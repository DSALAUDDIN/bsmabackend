const NoticeService = require('../services/noticeService');

class NoticeController {
  async createNotice(req, res) {
    try {
      const noticeData = { ...req.body, createdBy: req.user.id };
      const notice = await NoticeService.createNotice(noticeData);
      res.status(201).json({ success: true, data: notice });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getAllNotices(req, res) {
    try {
      const notices = await NoticeService.getAllNotices(req.query);
      res.status(200).json({ success: true, data: notices });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getNoticeById(req, res) {
    try {
      const notice = await NoticeService.getNoticeById(req.params.id);
      res.status(200).json({ success: true, data: notice });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async updateNotice(req, res) {
    try {
      const updatedNotice = await NoticeService.updateNotice(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedNotice });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deleteNotice(req, res) {
    try {
      const message = await NoticeService.deleteNotice(req.params.id);
      res.status(200).json({ success: true, message });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new NoticeController();
