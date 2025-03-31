class ConversationHistory {
  constructor() {
    this.histories = new Map();
    this.maxHistoryLength = 10; // 履歴の最大長を増やす
  }

  addMessage(channelId, role, content) {
    if (!this.histories.has(channelId)) {
      this.histories.set(channelId, []);
    }

    const history = this.histories.get(channelId);
    
    // メッセージを追加
    history.push({ role, content, timestamp: Date.now() });

    // 履歴が最大長を超えた場合、古いメッセージを削除
    while (history.length > this.maxHistoryLength) {
      history.shift();
    }

    console.log(`Added message to history for channel ${channelId}`);
    console.log(`Current history length: ${history.length}`);
  }

  getFormattedHistory(channelId) {
    const history = this.histories.get(channelId) || [];
    
    // 履歴を時系列順にフォーマット
    let formattedHistory = '';
    
    history.forEach((message, index) => {
      const timeAgo = this.getTimeAgo(message.timestamp);
      formattedHistory += `${message.role === 'user' ? 'ユーザー' : 'アシスタント'}: ${message.content} (${timeAgo})\n`;
      
      // 関連する検索結果があれば追加
      if (message.searchResults) {
        formattedHistory += `検索結果: ${message.searchResults}\n`;
      }
      
      // 最後のメッセージ以外は改行を追加
      if (index < history.length - 1) {
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