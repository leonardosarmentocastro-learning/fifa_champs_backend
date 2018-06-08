const axios = require('axios');

const { APP_CONFIG } = require('../../internals/configs');

class GiphyService {
  constructor() {
    this.axios = axios;

    this.APP_CONFIG = APP_CONFIG;
  }

  async fetchRandomGif() {
    const { giphy } = this.APP_CONFIG;

    const path = '/v1/gifs/random';
    const url = `http://${giphy.host}${path}`;
    const config = {
      params: {
        api_key: giphy.apiKey,
      },
    };

    const response = await this.axios.get(url, config);
    const gif = response.data;
    return gif;
  }

  async getGifFilteredBySize(size) {
    const gif = await this.fetchRandomGif();
    const sizeInBytes = gif.data.images.downsized_small.mp4_size;
    const sizeInKb = (sizeInBytes / 1000);

    const isFileTooBig = (sizeInKb > size);
    if (isFileTooBig) {
      return this.getGifFilteredBySize(size);
    }

    return gif;
  }

  async getFilteredListOfGifs(options) {
    const DEFAULT = {
      limit: 10, // The maximum number of gifs to return.
      filters: {
        sizeInKb: 100,
        // type: 'random', // NOTE: In case we want to extend this functionality...
      },
    };

    let { limit, filters } = options;
    limit = (limit || DEFAULT.limit);
    filters = (filters || DEFAULT.filters);

    const gifs = [];
    while (gifs.length < limit) {
      const size = filters.sizeInKb;
      const gif = await this.getGifFilteredBySize(size); // eslint-disable-line no-await-in-loop

      // Avoid adding again gifs that already exists on the list.
      const wasGifAlreadyAddedToList =
        gifs.find(element => (gif.data.id === element.data.id));
      if (!wasGifAlreadyAddedToList) {
        gifs.push(gif);
      }
    }

    return gifs;
  }
}

module.exports = GiphyService;
