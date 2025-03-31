class ConversationHistory {
  constructor() {
    this.histories = new Map();
    this.maxHistoryLength = 15; // 履歴の最大長を増やす
    this.contextWindow = 5; // 関連性の高い直近の会話数
  }

  addMessage(channelId, role, content) {
    if (!this.histories.has(channelId)) {
      this.histories.set(channelId, []);
    }

    const history = this.histories.get(channelId);
    
    // メッセージを追加
    history.push({ 
      role, 
      content, 
      timestamp: Date.now(),
      context: this.extractContext(content) // 文脈情報を追加
    });

    // 履歴が最大長を超えた場合、古いメッセージを削除
    while (history.length > this.maxHistoryLength) {
      history.shift();
    }

    console.log(`Added message to history for channel ${channelId}`);
    console.log(`Current history length: ${history.length}`);
  }

  extractContext(content) {
    // キーワードやトピックを抽出
    const keywords = content.match(/\b\w+\b/g) || [];
    return {
      keywords: [...new Set(keywords)], // 重複を除去
      timestamp: Date.now()
    };
  }

  getFormattedHistory(channelId) {
    const history = this.histories.get(channelId) || [];
    
    // 関連性の高い直近の会話を取得
    const recentHistory = history.slice(-this.contextWindow);
    
    let formattedHistory = '';
    
    recentHistory.forEach((message, index) => {
      const timeAgo = this.getTimeAgo(message.timestamp);
      formattedHistory += `${message.role === 'user' ? 'ユーザー' : 'アシスタント'}: ${message.content} (${timeAgo})\n`;
      
      // 関連するキーワードがあれば追加
      if (message.context && message.context.keywords.length > 0) {
        formattedHistory += `関連キーワード: ${message.context.keywords.join(', ')}\n`;
      }
      
      if (index < recentHistory.length - 1) {
        formattedHistory += '\n';
      }
    });

    return formattedHistory;
  }

  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    // 時間差を分単位で計算
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) {
      return '今';
    } else if (minutes < 60) {
      return `${minutes}分前`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours}時間前`;
    }
  }

  clearHistory(channelId) {
    if (this.histories.has(channelId)) {
      this.histories.delete(channelId);
      console.log(`Cleared history for channel ${channelId}`);
    }
  }

  // チャンネルごとの履歴を取得
  getHistory(channelId) {
    return this.histories.get(channelId) || [];
  }

  // 履歴の長さを取得
  getHistoryLength(channelId) {
    return (this.histories.get(channelId) || []).length;
  }
}

module.exports = ConversationHistory; 