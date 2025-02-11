const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db'); // Ensure this is an async function

const adminRoutes = require('./routes/adminRoutes');
const activityRoutes = require('./routes/activityRoutes');
const memberRoutes = require('./routes/memberRoutes');
const newsRoutes = require('./routes/newsRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve frontend (index.html) from the public directory
const bsRouter = express.Router();
bsRouter.use(express.static(path.join(__dirname, '..', 'public')));

// Serve index.html for the root route inside /bs
bsRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Health check API to verify API is running and DB is connected
bsRouter.get('/api/health', async (req, res) => {
    try {
        await connectDB(); // Ensure DB connection
        res.json({
            message: 'API is running well!',
            database: 'Connected',
            status: 'Success',
        });
    } catch (error) {
        res.status(500).json({
            message: 'API is running, but database connection failed!',
            database: 'Not Connected',
            status: 'Error',
            error: error.message,
        });
    }
});

// Redirect root to /bs
app.get('/', (req, res) => {
    res.redirect('/bs');
});

// API Routes
app.use('/bs/api/admin', adminRoutes);
app.use('/bs/api/activities', activityRoutes);
app.use('/bs/api/members', memberRoutes);
app.use('/bs/api/news', newsRoutes);
app.use('/bs/api/notices', noticeRoutes);

// Mount frontend/static files under /bs
app.use('/bs', bsRouter);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
