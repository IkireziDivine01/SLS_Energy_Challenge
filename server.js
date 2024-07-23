const express = require('express');
const { Pool } = require('pg');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./routes/user');

const app = express();
const port = 3000;

// Database configuration
const pool = require('./db');

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'A simple Express API for managing users',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local server',
            },
        ],
    },
    apis: ['./routes/user.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware to parse JSON bodies
app.use(express.json());

// Register routes
app.use('/users', userRoutes);

// Integrate Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// GET /q2 endpoint
app.get('/q2', async (req, res) => {
    const { user_id, type, phrase, hashtag } = req.query;

    try {
        let query = 'SELECT * FROM tweets';
        const values = [];
        let conditions = [];

        if (user_id) {
            conditions.push('user_id = $1');
            values.push(user_id);
        }

        if (type) {
            conditions.push('type = $2');
            values.push(type);
        }

        if (phrase) {
            conditions.push('text ILIKE $3');
            values.push(`%${phrase}%`);
        }

        if (hashtag) {
            conditions.push('EXISTS (SELECT 1 FROM hashtags WHERE hashtags.tweet_id = tweets.id AND hashtags.text = $4)');
            values.push(hashtag);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
