const Member = require('../models/memberModel');

class MemberService {
  // Create a new member
  async createMember(memberData) {
    const existingMember = await Member.findOne({ email: memberData.email });
    if (existingMember) {
      throw new Error('Email already registered');
    }

    return await Member.create(memberData);
  }

  // Get all members with optional filters and pagination
async getAllMembers(query = {}) {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;
  const filter = {};

  // Search functionality
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } }
    ];
  }

  // Fetch members with pagination and sorting
  const members = await Member.find(filter)
    .limit(limit * 1) // Limit to the requested number of members
    .skip((page - 1) * limit) // Skip based on the current page
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }); // Sort by requested field and order

  // Count the total number of matching members
  const count = await Member.countDocuments(filter);

  return {
    members,
    totalPages: Math.ceil(count / limit), // Calculate total pages
    currentPage: page,
    totalMembers: count
  };
}

  // Get a member by ID
  async getMemberById(id) {
    const member = await Member.findById(id);
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }

  // Update member details
  async updateMember(id, updateData) {
    const member = await Member.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }

  // Delete a member by ID
  async deleteMember(id) {
    const member = await Member.findById(id);
    if (!member) {
      throw new Error('Member not found');
    }
    await Member.findByIdAndDelete(id);
    return member;
  }
}

module.exports = new MemberService();
