const pool = require('../db'); // Assuming db.js exports the database pool
const { Op } = require('sequelize');

/**
 * Get all 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */

//get all tweets
exports.getAllTweets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;

        const countResult = await pool.query('SELECT COUNT(*) FROM tweets');
        const totalTweets = parseInt(countResult.rows[0].count);

        const result = await pool.query('SELECT * FROM tweets ORDER BY created_at DESC OFFSET $1 LIMIT $2', [offset, limit]);
        
        res.json({
            tweets: result.rows,
            currentPage: page,
            totalPages: Math.ceil(totalTweets / limit),
            totalTweets: totalTweets
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

//search tweet
exports.searchTweets = async (req, res) => {
    try {
        const query = req.query.q;
        const lang = req.query.lang;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;

        let sqlQuery = `
            SELECT * FROM tweets
            WHERE to_tsvector('english', text) @@ plainto_tsquery('english', $1)
        `;
        let params = [query];

        if (lang) {
            sqlQuery += ` AND lang = $${params.length + 1}`;
            params.push(lang);
        }

        // Count total matching tweets
        const countResult = await pool.query(`SELECT COUNT(*) FROM (${sqlQuery}) AS count_query`, params);
        const totalTweets = parseInt(countResult.rows[0].count);

        // Add ordering and pagination
        sqlQuery += ` ORDER BY created_at DESC OFFSET $${params.length + 1} LIMIT $${params.length + 2}`;
        params.push(offset, limit);

        // Execute the final query
        const result = await pool.query(sqlQuery, params);
        
        res.json({
            tweets: result.rows,
            currentPage: page,
            totalPages: Math.ceil(totalTweets / limit),
            totalTweets: totalTweets,
            searchQuery: query,
            language: lang || 'all'
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

//get tweets by date range
exports.getTweetsByDateRange = async (req, res) => {
    try {
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;

        const countResult = await pool.query('SELECT COUNT(*) FROM tweets WHERE created_at BETWEEN $1 AND $2', [startDate, endDate]);
        const totalTweets = parseInt(countResult.rows[0].count);

        const result = await pool.query(
            'SELECT * FROM tweets WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at DESC OFFSET $3 LIMIT $4',
            [startDate, endDate, offset, limit]
        );
        
        res.json({
            tweets: result.rows,
            currentPage: page,
            totalPages: Math.ceil(totalTweets / limit),
            totalTweets: totalTweets,
            startDate: startDate,
            endDate: endDate
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

//get most favorited tweets
exports.getMostFavoritedTweets = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;

        const result = await pool.query(
            'SELECT * FROM tweets ORDER BY favorite_count DESC LIMIT $1',
            [limit]
        );
        
        res.json({
            tweets: result.rows,
            limit: limit
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

//get most retweeted tweets
exports.getMostRetweetedTweets = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;

        const result = await pool.query(
            'SELECT * FROM tweets ORDER BY retweet_count DESC LIMIT $1',
            [limit]
        );
        
        res.json({
            tweets: result.rows,
            limit: limit
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};
