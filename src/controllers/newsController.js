const NewsService = require('../services/newsService');

class NewsController {
  async createNews(req, res) {
    try {
      const newsData = req.body;
      const news = await NewsService.createNews(newsData);
      res.status(201).json({ success: true, data: news });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getAllNews(req, res) {
    try {
      const newsList = await NewsService.getAllNews(req.query);
      res.status(200).json({ success: true, data: newsList });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getNewsById(req, res) {
    try {
      const news = await NewsService.getNewsById(req.params.id);
      res.status(200).json({ success: true, data: news });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async updateNews(req, res) {
    try {
      const updatedNews = await NewsService.updateNews(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedNews });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deleteNews(req, res) {
    try {
      const message = await NewsService.deleteNews(req.params.id);
      res.status(200).json({ success: true, message: message });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new NewsController();
