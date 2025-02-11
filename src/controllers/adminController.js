const adminService = require('../services/adminService');
const { formatResponse } = require('../utils/helpers');

class AdminController {
  async register(req, res) {
    try {
      const data = await adminService.register(req.body);
      res.status(201).json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

  async login(req, res) {
    try {
      const data = await adminService.login(req.body);
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(401).json(formatResponse(false, null, error.message));
    }
  }

  async createAdmin(req, res) {
    try {
      const data = await adminService.createAdmin(req.body);
      res.status(201).json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

  async getAllAdmins(req, res) {
    try {
      const data = await adminService.getAllAdmins();
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

  async getAdminById(req, res) {
    try {
      const data = await adminService.getAdminById(req.params.id);
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(404).json(formatResponse(false, null, error.message));
    }
  }

  async updateAdmin(req, res) {
    try {
      const data = await adminService.updateAdmin(req.params.id, req.body);
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

  async deleteAdmin(req, res) {
    try {
      const data = await adminService.deleteAdmin(req.params.id);
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(404).json(formatResponse(false, null, error.message));
    }
  }

  async changePassword(req, res) {
    try {
      const data = await adminService.changePassword(req.user._id, req.body);
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }
}

module.exports = new AdminController();
