const Notice = require('../models/noticeModel');

class NoticeService {
  async createNotice(noticeData) {
    return await Notice.create(noticeData);
  }

  async getAllNotices(query = {}) {
    const { page = 1, limit = 10, category, status, sortBy = 'noticeDate', sortOrder = 'desc' } = query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const notices = await Notice.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const count = await Notice.countDocuments(filter);

    return {
      notices,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalNotices: count
    };
  }

  async getNoticeById(id) {
    const notice = await Notice.findById(id);
    if (!notice) throw new Error('Notice not found');
    return notice;
  }

  async updateNotice(id, updateData) {
    const notice = await Notice.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!notice) throw new Error('Notice not found');
    return notice;
  }

  async deleteNotice(id) {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) throw new Error('Notice not found');
    return { message: 'Notice deleted successfully' };
  }
}

module.exports = new NoticeService();
