const GiphyService = require('./service');

const giphyService = new GiphyService();

const controller = {
  async getListOfRandomGifs(req, res) {
    try {
      const options = {
        limit: 10,
      };
      const gifs = await giphyService.getFilteredListOfGifs(options);

      return res.status(200).json(gifs);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = controller;
