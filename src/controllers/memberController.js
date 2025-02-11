const memberService = require('../services/memberService');
const { formatResponse } = require('../utils/helpers');

class MemberController {
  async createMember(req, res) {
    try {
      // Validate required fields
      const requiredFields = [
        'memberNumber',
        'name',
        'designation',
        'companyName',
        'email',
        'phoneNumber',
        'address',
        'nid'
      ];

      const missingFields = requiredFields.filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json(
          formatResponse(false, null, `Missing required fields: ${missingFields.join(', ')}`)
        );
      }

      // Validate social media URLs if provided
      if (req.body.socialMedia) {
        const { linkedin, twitter, facebook, instagram } = req.body.socialMedia;
        const urlPattern = /^https?:\/\/.+/;

        if (linkedin && !urlPattern.test(linkedin)) {
          return res.status(400).json(formatResponse(false, null, 'Invalid LinkedIn URL'));
        }
        if (facebook && !urlPattern.test(facebook)) {
          return res.status(400).json(formatResponse(false, null, 'Invalid Facebook URL'));
        }
        if (instagram && !instagram.startsWith('@')) {
          return res.status(400).json(formatResponse(false, null, 'Invalid Instagram handle'));
        }
        if (twitter && !twitter.startsWith('@')) {
          return res.status(400).json(formatResponse(false, null, 'Invalid Twitter handle'));
        }
      }

      const data = await memberService.createMember(req.body);
      res.status(201).json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

  async getAllMembers(req, res) {
    try {
      // Validate query parameters
      const { page, limit, sortOrder } = req.query;

      if (page && (isNaN(page) || page < 1)) {
        return res.status(400).json(
          formatResponse(false, null, 'Page number must be a positive integer')
        );
      }

      if (limit && (isNaN(limit) || limit < 1)) {
        return res.status(400).json(
          formatResponse(false, null, 'Limit must be a positive integer')
        );
      }

      if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json(
          formatResponse(false, null, 'Sort order must be either "asc" or "desc"')
        );
      }

      const data = await memberService.getAllMembers(req.query);
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

  async getMemberById(req, res) {
    try {
      const data = await memberService.getMemberById(req.params.id);
      if (!data) {
        return res.status(404).json(formatResponse(false, null, 'Member not found'));
      }
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(404).json(formatResponse(false, null, error.message));
    }
  }

  async updateMember(req, res) {
    try {
      // Prevent updating sensitive fields directly
      const protectedFields = ['role', 'payments', 'participatedEvents'];
      const hasProtectedFields = protectedFields.some(field => field in req.body);

      if (hasProtectedFields) {
        return res.status(400).json(
          formatResponse(false, null, 'Cannot update protected fields directly')
        );
      }

      const data = await memberService.updateMember(req.params.id, req.body);
      if (!data) {
        return res.status(404).json(formatResponse(false, null, 'Member not found'));
      }
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

  async deleteMember(req, res) {
    try {
      const data = await memberService.deleteMember(req.params.id);
      if (!data) {
        return res.status(404).json(formatResponse(false, null, 'Member not found'));
      }
      res.json(formatResponse(true, { message: 'Member deleted successfully' }));
    } catch (error) {
      res.status(404).json(formatResponse(false, null, error.message));
    }
  }


  async searchMembers(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.length < 2) {
        return res.status(400).json(
          formatResponse(false, null, 'Search query must be at least 2 characters long')
        );
      }

      const data = await memberService.searchMembers(query);
      res.json(formatResponse(true, data));
    } catch (error) {
      res.status(400).json(formatResponse(false, null, error.message));
    }
  }

}

module.exports = new MemberController();
