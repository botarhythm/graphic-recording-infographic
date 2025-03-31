const axios = require('axios');
const NodeCache = require('node-cache');
const cheerio = require('cheerio');

class WebSearch {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // 1時間のキャッシュ
    this.maxResults = 5;
    this.timeout = 5000; // 5秒のタイムアウト
  }

  async search(query) {
    try {
      // URLかどうかをチェック
      if (this.isValidUrl(query)) {
        return await this.fetchUrlContent(query);
      }

      // キャッシュをチェック
      const cacheKey = `search_${query}`;
      const cachedResults = this.cache.get(cacheKey);
      if (cachedResults) {
        console.log('Using cached search results');
        return cachedResults;
      }

      // 複数の検索ソースから結果を取得
      const [duckDuckGoResults, wikipediaResults] = await Promise.all([
        this.searchDuckDuckGo(query),
        this.searchWikipedia(query)
      ]);

      // 結果を統合
      const results = [...duckDuckGoResults, ...wikipediaResults];
      
      // 結果をキャッシュ
      this.cache.set(cacheKey, results);
      
      return results;
    } catch (error) {
      console.error('Search error:', error.message);
      return {
        error: true,
        message: '検索中にエラーが発生しました。'
      };
    }
  }

  async searchDuckDuckGo(query) {
    try {
      const response = await axios.get('https://api.duckduckgo.com/', {
        params: {
          q: query,
          format: 'json',
          no_html: 1,
          skip_disambig: 1
        },
        timeout: this.timeout
      });

      return this.processDuckDuckGoResults(response.data);
    } catch (error) {
      console.error('DuckDuckGo search error:', error.message);
      return [];
    }
  }

  async searchWikipedia(query) {
    try {
      const response = await axios.get('https://ja.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json',
          srlimit: 3,
          utf8: 1,
          origin: '*'
        },
        timeout: this.timeout
      });

      return this.processWikipediaResults(response.data);
    } catch (error) {
      console.error('Wikipedia search error:', error.message);
      return [];
    }
  }

  processDuckDuckGoResults(data) {
    const results = [];

    // 抽象（要約）を追加
    if (data.Abstract) {
      results.push({
        title: '概要',
        content: data.Abstract,
        source: data.AbstractSource,
        type: 'duckduckgo'
      });
    }

    // 関連トピックを追加
    if (data.RelatedTopics) {
      data.RelatedTopics
        .slice(0, this.maxResults)
        .forEach(topic => {
          if (topic.Text) {
            results.push({
              title: topic.FirstURL.split('/').pop(),
              content: topic.Text,
              source: topic.FirstURL,
              type: 'duckduckgo'
            });
          }
        });
    }

    return results;
  }

  processWikipediaResults(data) {
    const results = [];
    
    if (data.query && data.query.search) {
      data.query.search.forEach(item => {
        results.push({
          title: item.title,
          content: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
          source: `https://ja.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
          type: 'wikipedia'
        });
      });
    }

    return results;
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async fetchUrlContent(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      // メタデータを取得
      const title = $('title').text() || url;
      const description = $('meta[name="description"]').attr('content') || '';
      
      // 本文を取得（不要な要素を除外）
      $('script, style, nav, header, footer, iframe, .advertisement, .social-share').remove();
      
      // 重要なセクションを優先的に取得
      const mainContent = $('article, main, .content, .post-content, .entry-content').text() || $('body').text();
      const content = mainContent.trim().substring(0, 2000);

      // 関連リンクを取得
      const links = [];
      $('a').each((i, elem) => {
        const href = $(elem).attr('href');
        if (href && !href.startsWith('#')) {
          links.push(href);
        }
      });

      return [{
        title: title,
        content: `${description}\n\n${content}`,
        source: url,
        links: links.slice(0, 5) // 関連リンクを最大5件まで
      }];
    } catch (error) {
      console.error('URL fetch error:', error.message);
      return {
        error: true,
        message: 'URLの内容を取得できませんでした。'
      };
    }
  }

  formatResults(results) {
    if (results.error) {
      return results.message;
    }

    let formatted = '検索結果:\n\n';
    
    results.forEach((result, index) => {
      formatted += `${index + 1}. ${result.title}\n`;
      formatted += `${result.content}\n`;
      formatted += `出典: ${result.source}\n`;
      
      // 関連リンクがあれば追加
      if (result.links && result.links.length > 0) {
        formatted += '関連リンク:\n';
        result.links.forEach(link => {
          formatted += `- ${link}\n`;
        });
      }
      
      formatted += '\n';
    });

    return formatted;
  }
}

module.exports = WebSearch; 