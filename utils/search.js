const axios = require('axios');

class BraveSearch {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.search.brave.com/res/v1/web/search';
  }

  async search(query) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          count: 5,
          search_lang: 'ja',
          text_format: 'plain'
        },
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error.response?.status, error.response?.data);
      throw error;
    }
  }

  formatSearchResults(results) {
    if (!results.web || !results.web.results) {
      return '検索結果が見つかりませんでした。';
    }

    let formattedResults = '検索結果:\n\n';
    results.web.results.slice(0, 3).forEach((result, index) => {
      formattedResults += `${index + 1}. ${result.title}\n`;
      formattedResults += `${result.description}\n`;
      if (result.snippet) {
        formattedResults += `詳細: ${result.snippet}\n`;
      }
      formattedResults += `URL: ${result.url}\n\n`;
    });

    return formattedResults;
  }
}

module.exports = BraveSearch; 