const Admin = require('../models/adminModel');
const { generateToken } = require('../utils/helpers');

class AdminService {
  async register(adminData) {
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      throw new Error('Admin already exists');
    }

    // For the first admin, set role as 'admin'
    const admin = await Admin.create({ ...adminData, role: 'admin' });

    // Generate token
    const token = generateToken(admin._id);

    return {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      token
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    // Validate email and password
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Check for admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(admin._id);

    return {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      token
    };
  }

  async createAdmin(adminData) {
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      throw new Error('Admin already exists');
    }

    // Admin role can be specified by the frontend
    const admin = await Admin.create(adminData);

    return {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role
    };
  }

  async getAllAdmins() {
    return Admin.find().select('-password');  // Return all admins without password field
  }

  async getAdminById(id) {
    const admin = await Admin.findById(id).select('-password');  // Return specific admin by ID without password
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async updateAdmin(id, updateData) {
    // Remove sensitive fields (like password and role) from the update data
    const { password, role, ...data } = updateData;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { $set: data }, // Update only the data fields, not password or role
      { new: true }
    ).select('-password');

    if (!admin) {
      throw new Error('Admin not found');
    }

    return admin;
  }

  async deleteAdmin(id) {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }

  async changePassword(id, { currentPassword, newPassword }) {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return { message: 'Password updated successfully' };
  }
}

module.exports = new AdminService();
