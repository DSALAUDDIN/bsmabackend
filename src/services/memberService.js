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
    const { sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const filter = {};

    // Search functionality
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } }
      ];
    }

    // Create a query to fetch members with sorting (without any pagination limit)
    const memberQuery = Member.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }); // Sort by requested field and order

    // Execute the query to get all members
    const members = await memberQuery;

    // Count the total number of matching members
    const count = await Member.countDocuments(filter);

    return {
      members,
      totalPages: 1, // With no pagination, everything is on one "page"
      currentPage: 1,
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
