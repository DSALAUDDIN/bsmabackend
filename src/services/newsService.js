// const News = require('../models/newsModel');
//
// class NewsService {
//   async createNews(newsData) {
//     const requiredFields = ['title', 'content', 'imageUrl', 'author', 'category'];
//     const missingFields = requiredFields.filter(field => !newsData[field]);
//
//     if (missingFields.length > 0) {
//       throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
//     }
//
//     return await News.create(newsData);
//   }
//
//   async getAllNews(query = {}) {
//     const { page = 1, limit = 10, category, status, sortBy = 'publishedDate', sortOrder = 'desc' } = query;
//
//     const filter = {};
//     if (category) filter.category = category;
//     if (status) filter.status = status;
//
//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
//
//     const newsList = await News.find(filter)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort(sortOptions);
//
//     const count = await News.countDocuments(filter);
//
//     return {
//       news: newsList,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       totalNews: count
//     };
//   }
//
//   async getNewsById(id) {
//     const news = await News.findById(id);
//     if (!news) {
//       throw new Error('News not found');
//     }
//     return news;
//   }
//
//   async updateNews(id, updateData) {
//     const news = await News.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );
//
//     if (!news) {
//       throw new Error('News not found');
//     }
//     return news;
//   }
//
//   async deleteNews(id) {
//     const news = await News.findByIdAndDelete(id);
//     if (!news) {
//       throw new Error('News not found');
//     }
//     return { message: 'News deleted successfully' };
//   }
// }
//
// module.exports = new NewsService();

// services/newsService.js

// Make sure you import your Mongoose model correctly
const News = require('../models/newsModel'); // Adjust path if necessary

class NewsService {
  async createNews(newsData) {
    // Keep your existing validation logic
    const requiredFields = ['title', 'content', 'imageUrl', 'author', 'category'];
    const missingFields = requiredFields.filter(field => !newsData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    // Ensure publishedDate is set if not provided, or handle defaults as needed
    if (!newsData.publishedDate) {
      newsData.publishedDate = new Date();
    }

    try {
      return await News.create(newsData);
    } catch (error) {
      console.error("Error creating news:", error);
      // Provide a more specific error message if possible (e.g., duplicate key)
      throw new Error(`Failed to create news item: ${error.message}`);
    }
  }

  // --- CORRECTED getAllNews function ---
  async getAllNews(query = {}) {
    console.log("Service received query:", query); // Log received query params for debugging

    // Destructure potential query parameters for filtering and sorting
    const { category, status, sortBy = 'publishedDate', sortOrder = 'desc' } = query;

    // --- Determine if server-side pagination is requested ---
    // Check if 'page' or 'limit' were actually passed in the query string
    const isPaginationRequested = query.hasOwnProperty('page') || query.hasOwnProperty('limit');

    // Use provided page/limit, applying defaults *only* if pagination IS requested but values are missing/invalid
    const page = parseInt(query.page, 10) || 1;       // Default to 1 if page requested but invalid
    const limit = parseInt(query.limit, 10) || 10;     // Default to 10 if limit requested but invalid

    // --- Build Filter and Sort Criteria ---
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    // Add more filters if needed (e.g., date range) based on query params

    const sortOptions = {};
    // Basic validation for sortBy field if needed, otherwise trust input or use model schema defaults
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // --- Build Database Query ---
    let dbQuery = News.find(filter) // Start with finding documents matching the filter
        .sort(sortOptions);   // Apply sorting

    try {
      // --- Conditionally Apply Server-Side Pagination ---
      if (isPaginationRequested && limit > 0) {
        // Apply skip and limit ONLY if pagination params were in the URL query AND limit is positive
        console.log(`Applying SERVER-SIDE pagination: Page ${page}, Limit ${limit}`); // Debugging log
        dbQuery = dbQuery.skip((page - 1) * limit).limit(limit);
      } else {
        // No pagination requested (or limit <= 0), so fetch ALL matching items
        console.log(`Fetching ALL news matching filter (no server-side pagination applied).`); // Debugging log
      }

      // --- Execute Query ---
      const newsList = await dbQuery.lean(); // Use .lean() for faster plain JS objects if not modifying docs

      // --- Get Total Count (always needed for potential pagination info) ---
      const count = await News.countDocuments(filter);

      // --- Determine Return Values ---
      let totalPages = 1;
      let currentPage = 1; // Default to 1 if returning all items

      if (isPaginationRequested && limit > 0) {
        // If server paginated, calculate total pages based on limit
        totalPages = Math.ceil(count / limit);
        currentPage = page; // Use the requested page
      } else {
        // If all news were fetched, there's effectively only 1 "page" of all results (or 0 if none)
        totalPages = count > 0 ? 1 : 0;
        // currentPage remains 1
      }

      console.log(`Returning ${newsList.length} news items. Total matching: ${count}. Total Pages: ${totalPages}. Current Page: ${currentPage}`);

      // Return structure expected by the controller (and implicitly, the frontend)
      return {
        news: newsList,       // The fetched news (either paginated subset or all)
        totalPages: totalPages, // Total pages (adjusted based on whether pagination was applied)
        currentPage: currentPage, // Current page (requested page or 1 if all)
        totalNews: count        // Total matching news count in the DB
      };

    } catch (error) {
      console.error("Error fetching news in service:", error);
      throw new Error(`Failed to retrieve news: ${error.message}`);
    }
  }
  // --- END OF CORRECTED getAllNews ---

  async getNewsById(id) {
    try {
      const news = await News.findById(id).lean(); // Use lean if just reading
      if (!news) {
        throw new Error('News not found');
      }
      return news;
    } catch (error) {
      console.error(`Error fetching news by ID ${id}:`, error);
      // Check if it's a CastError (invalid ID format)
      if (error.name === 'CastError') {
        throw new Error(`Invalid news ID format: ${id}`);
      }
      throw new Error(`Failed to retrieve news by ID: ${error.message}`);
    }
  }

  async updateNews(id, updateData) {
    try {
      // Remove fields that shouldn't be updated directly if necessary (e.g., _id, createdAt)
      delete updateData._id;
      delete updateData.createdAt;
      // Ensure publishedDate is handled correctly if updated
      if (updateData.publishedDate) {
        updateData.publishedDate = new Date(updateData.publishedDate);
      }

      const news = await News.findByIdAndUpdate(
          id,
          { $set: updateData }, // Use $set to update only provided fields
          { new: true, runValidators: true } // Return updated doc, run schema validators
      ).lean(); // Use lean if you don't need the full Mongoose object afterward

      if (!news) {
        throw new Error('News not found for update');
      }
      return news;
    } catch (error) {
      console.error(`Error updating news ID ${id}:`, error);
      throw new Error(`Failed to update news: ${error.message}`);
    }
  }

  async deleteNews(id) {
    try {
      const news = await News.findByIdAndDelete(id);
      if (!news) {

        throw new Error('News not found for deletion');
      }
      return { message: 'News deleted successfully' };
    } catch (error) {
      console.error(`Error deleting news ID ${id}:`, error);
      throw new Error(`Failed to delete news: ${error.message}`);
    }
  }
}

module.exports = new NewsService();