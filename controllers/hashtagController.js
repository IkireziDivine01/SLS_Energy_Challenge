const pool = require('../db'); // Assuming db.js exports the database pool

const hashtagController = {
    // Get all hashtags
    getAllHashtags: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const offset = (page - 1) * limit;

            // Get total count of hashtags
            const countResult = await pool.query('SELECT COUNT(*) FROM hashtags');
            const totalHashtags = parseInt(countResult.rows[0].count);

            // Get hashtags for the current page
            const result = await pool.query(
                'SELECT * FROM hashtags OFFSET $1 LIMIT $2',
                [offset, limit]
            );

            res.json({
                hashtags: result.rows,
                currentPage: page,
                totalPages: Math.ceil(totalHashtags / limit),
                totalHashtags: totalHashtags
            });
        } catch (error) {
            console.error('Error retrieving hashtags:', error);
            res.status(500).json({ message: 'Error retrieving hashtags', error: error.message });
        }
    },

    // Get a specific hashtag by tweet_id and text
    getHashtag: async (req, res) => {
        const { tweet_id, text } = req.params;
        try {
            const result = await pool.query(
                'SELECT * FROM hashtags WHERE tweet_id = $1 AND text = $2',
                [tweet_id, text]
            );
            const hashtag = result.rows[0];
            if (hashtag) {
                res.json(hashtag);
            } else {
                res.status(404).json({ message: 'Hashtag not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving hashtag', error: error.message });
        }
    },

    // Get hashtags by tweet_id
    getHashtagsByTweetId: async (req, res) => {
        const { tweet_id } = req.params;
        try {
            const result = await pool.query(
                'SELECT * FROM hashtags WHERE tweet_id = $1',
                [tweet_id]
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving hashtags', error: error.message });
        }
    },

    // Search hashtags
    searchHashtags: async (req, res) => {
        try {
            const query = req.query.query; // Extract the 'query' parameter
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const offset = (page - 1) * limit;

            // Check if query is undefined or empty
            if (!query) {
                return res.status(400).json({ message: 'Search query is required' });
            }

            console.log('Search query:', query); // Log the query for debugging

            // Get total count of matching hashtags
            const countResult = await pool.query(
                'SELECT COUNT(*) FROM hashtags WHERE text ILIKE $1',
                [`%${query}%`]
            );
            const totalHashtags = parseInt(countResult.rows[0].count);

            // Get matching hashtags for the current page
            const result = await pool.query(
                'SELECT * FROM hashtags WHERE text ILIKE $1 OFFSET $2 LIMIT $3',
                [`%${query}%`, offset, limit]
            );

            res.json({
                hashtags: result.rows,
                currentPage: page,
                totalPages: Math.ceil(totalHashtags / limit),
                totalHashtags: totalHashtags
            });
        } catch (error) {
            console.error('Error searching hashtags:', error);
            res.status(500).json({
                message: 'Error searching hashtags',
                error: error.message,
                sql: error.sql,
                parameters: error.parameters,
                query: req.query // Include the entire query object for debugging
            });
        }
    }
};

module.exports = hashtagController;
