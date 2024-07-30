const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: Tweet management
 */

/**
 * @openapi
 * /tweets:
 *   get:
 *     summary: Retrieve a list of tweets with pagination
 *     tags: [Tweets]
 *     description: Get tweets with pagination support. Use query parameters to control the page and limit.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: The number of tweets to retrieve per page
 *     responses:
 *       200:
 *         description: A paginated list of tweets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tweets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tweet'
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 totalTweets:
 *                   type: integer
 *                   description: The total number of tweets
 *       500:
 *         description: Internal server error
 */
router.get('/', tweetController.getAllTweets);

/**
 * @openapi
 * /tweets/search:
 *   get:
 *     summary: Search tweets
 *     tags: [Tweets]
 *     description: Search tweets based on a query and optionally filter by language.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: The language code to filter tweets
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: The number of tweets to retrieve per page
 *     responses:
 *       200:
 *         description: A paginated list of tweets matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tweets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tweet'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalTweets:
 *                   type: integer
 *                 searchQuery:
 *                   type: string
 *                 language:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get('/search', tweetController.searchTweets);

/**
 * @openapi
 * /tweets/date-range:
 *   get:
 *     summary: Get tweets by date range
 *     tags: [Tweets]
 *     description: Retrieve tweets within a specific date range with pagination support.
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: The number of tweets to retrieve per page
 *     responses:
 *       200:
 *         description: A paginated list of tweets within the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tweets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tweet'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalTweets:
 *                   type: integer
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *       500:
 *         description: Internal server error
 */
router.get('/date-range', tweetController.getTweetsByDateRange);

/**
 * @openapi
 * /tweets/top/favorited:
 *   get:
 *     summary: Get most favorited tweets
 *     tags: [Tweets]
 *     description: Retrieve the most favorited tweets.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: The number of tweets to retrieve
 *     responses:
 *       200:
 *         description: A list of the most favorited tweets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tweets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tweet'
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/top/favorited', tweetController.getMostFavoritedTweets);

/**
 * @openapi
 * /tweets/top/retweeted:
 *   get:
 *     summary: Get most retweeted tweets
 *     tags: [Tweets]
 *     description: Retrieve the most retweeted tweets.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: The number of tweets to retrieve
 *     responses:
 *       200:
 *         description: A list of the most retweeted tweets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tweets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tweet'
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/top/retweeted', tweetController.getMostRetweetedTweets);

module.exports = router;