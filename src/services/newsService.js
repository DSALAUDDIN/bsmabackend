const News = require('../models/newsModel');

class NewsService {
  async createNews(newsData) {
    const requiredFields = ['title', 'content', 'imageUrl', 'author', 'category'];
    const missingFields = requiredFields.filter(field => !newsData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return await News.create(newsData);
  }

  async getAllNews(query = {}) {
    const { page = 1, limit = 10, category, status, sortBy = 'publishedDate', sortOrder = 'desc' } = query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const newsList = await News.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const count = await News.countDocuments(filter);

    return {
      news: newsList,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalNews: count
    };
  }

  async getNewsById(id) {
    const news = await News.findById(id);
    if (!news) {
      throw new Error('News not found');
    }
    return news;
  }

  async updateNews(id, updateData) {
    const news = await News.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!news) {
      throw new Error('News not found');
    }
    return news;
  }

  async deleteNews(id) {
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      throw new Error('News not found');
    }
    return { message: 'News deleted successfully' };
  }
}

module.exports = new NewsService();
