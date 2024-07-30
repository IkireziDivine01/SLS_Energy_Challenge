const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for your Twitter Data Analysis application',
        },
        servers: [
            {
                url: 'http://localhost:${port}',
                description: 'Local server',
            },
        ],
    },
    apis: ['../routes/user.js', '../routes/tweets.js', '../routes/hashtag.js'], // Path to your API files
};

const specs = swaggerJSDoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = swaggerDocs;
