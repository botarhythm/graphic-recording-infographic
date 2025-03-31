require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const character = require('./config/character');
const ConversationHistory = require('./utils/conversationHistory');
const BraveSearch = require('./utils/search');

// 環境変数の確認
console.log('Environment variables:');
console.log('PREFIX:', process.env.PREFIX);
console.log('CHANNEL_ID:', process.env.CHANNEL_ID);
console.log('GUILD_ID:', process.env.GUILD_ID);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '設定されています' : '未設定です');
console.log('BRAVE_API_KEY:', process.env.BRAVE_API_KEY ? '設定されています' : '未設定です');

// Discordクライアントの初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction
  ]
});

// Gemini APIの初期化
let model;
try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-lite",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });
  console.log('Gemini API initialized successfully');
} catch (error) {
  console.error('Gemini API initialization error:', error);
}

// 会話履歴の初期化
const conversationHistory = new ConversationHistory(10);

// BraveSearchの初期化
const braveSearch = new BraveSearch(process.env.BRAVE_API_KEY);

// ボットが準備できたときの処理
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot is running in Guild: ${process.env.GUILD_ID}`);
  console.log(`Listening in Channel: ${process.env.CHANNEL_ID}`);
  
  // ボットの状態を確認
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  if (guild) {
    console.log(`Found guild: ${guild.name}`);
    const channel = await guild.channels.fetch(process.env.CHANNEL_ID);
    if (channel) {
      console.log(`Found channel: ${channel.name}`);
    } else {
      console.log('Target channel not found!');
    }
  } else {
    console.log('Target guild not found!');
  }
});

// メッセージを受信したときの処理
client.on('messageCreate', async message => {
  console.log('=== New Message ===');
  console.log(`Content: ${message.content}`);
  console.log(`Channel ID: ${message.channelId}`);
  console.log(`Author: ${message.author.tag}`);
  console.log(`Is Bot: ${message.author.bot}`);
  console.log(`Guild ID: ${message.guildId}`);
  console.log(`Is DM: ${!message.guildId}`);

  // ボットのメッセージは無視
  if (message.author.bot) {
    console.log('Ignoring bot message');
    return;
  }

  // DMまたは特定のチャンネルでのみ動作するように設定
  if (message.guildId && message.channelId !== process.env.CHANNEL_ID) {
    console.log('Message not in target channel');
    return;
  }

  let prompt = '';
  const botMention = `<@${client.user.id}>`;

  console.log('Checking message content...');
  console.log(`Message mentions bot? ${message.mentions.users.has(client.user.id)}`);

  // DMの場合はメンションなしでも応答
  if (!message.guildId) {
    prompt = message.content.trim();
    console.log('DM detected, prompt:', prompt);
  } else if (message.mentions.users.has(client.user.id)) {
    // メンションを除去してプロンプトを取得
    prompt = message.content.replace(/<@!?\d+>/g, '').trim();
    console.log('Mention detected, prompt:', prompt);
  } else {
    console.log('No mention detected');
    return;
  }

  if (!prompt) {
    console.log('Empty prompt, ignoring');
    return;
  }

  console.log('Processing prompt:', prompt);
  
  try {
    // タイピング中を表示
    message.channel.sendTyping();
    
    if (!model) {
      throw new Error('Gemini API is not initialized');
    }

    // ユーザーのメッセージを履歴に追加
    conversationHistory.addMessage(message.channel.id, 'user', prompt);

    // 検索が必要かどうかを確認
    const shouldSearch = prompt.includes('BraveSearchで検索して');
    let searchResults = '';
    
    if (shouldSearch) {
      try {
        // 検索クエリから装飾文字を除去
        const searchQuery = prompt
          .replace('BraveSearchで検索して', '')
          .replace(/[「」『』]/g, '')
          .trim();
        
        if (!searchQuery) {
          searchResults = '検索キーワードを指定してください。';
        } else {
          console.log('Executing search for:', searchQuery);
          const results = await braveSearch.search(searchQuery);
          searchResults = braveSearch.formatSearchResults(results);
          console.log('Search results:', searchResults);
        }
      } catch (error) {
        console.error('Search error:', error);
        searchResults = '検索中にエラーが発生しました。';
      }
    }

    // システムプロンプトと会話履歴、ユーザーのプロンプトを組み合わせる
    const history = conversationHistory.getFormattedHistory(message.channel.id);
    const fullPrompt = `${character.systemPrompt}\n\n会話履歴:\n${history}\n\n${searchResults ? `参考情報:\n${searchResults}\n\n` : ''}ユーザー: ${prompt}\n\n${character.name}:`;
    
    // Gemini APIで応答を生成
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    await message.reply(text);
    conversationHistory.addMessage(message.channel.id, 'assistant', text);
  } catch (error) {
    console.error('Error details:', error);
    await message.reply('申し訳ありません。エラーが発生しました。\n' + error.message);
  }
});

// エラーハンドリング
client.on('error', error => {
  console.error('Discord client error:', error);
});

// ボットをログイン
client.login(process.env.DISCORD_TOKEN); 