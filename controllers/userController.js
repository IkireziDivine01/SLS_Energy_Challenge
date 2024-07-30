const pool = require('../db'); // Assuming db.js exports the database pool

/**
 * Get all users or filter by name
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;

        const countResult = await pool.query('SELECT COUNT(*) FROM users');
        const totalUsers = parseInt(countResult.rows[0].count);

        const result = await pool.query('SELECT * FROM users OFFSET $1 LIMIT $2', [offset, limit]);
        
        res.json({
            users: result.rows,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers: totalUsers
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get users by name
exports.getUsersByName = async (req, res) => {
    const { name } = req.query;
    const query = name ? 'SELECT * FROM users WHERE name ILIKE $1' : 'SELECT * FROM users';
    const values = name ? [`%${name}%`] : [];

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
    }
};

