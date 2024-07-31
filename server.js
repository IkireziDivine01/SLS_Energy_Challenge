const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./routes/user');
const tweetRoutes = require('./routes/tweets');
const hashtagRoutes = require('./routes/hashtag')
const q2 = require('./routes/q2')

const app = express();
const port = 3000;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Twitter-like API',
            version: '1.0.0',
            description: 'API for managing users and tweets',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local server',
            },
        ],
        tags: [
            {
                name: 'Q2',
                description: ''
            },
            {
                name: 'Users',
                description: 'User management'
            },
            {
                name: 'Tweets',
                description: 'Tweet management'
            },
            {
                name: 'Hashtags',
                description: 'Hashtag management'
            }
        ]
    },
    apis: ['./routes/user.js', './routes/tweets.js', './routes/hashtag.js', './routes/q2.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/tweets', tweetRoutes);
app.use('/hashtags', hashtagRoutes);
app.use('/q2', q2)
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});