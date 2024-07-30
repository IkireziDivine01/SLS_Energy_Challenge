const express = require('express');
const router = express.Router();
const hashtagController = require('../controllers/hashtagController');

/**
 * @swagger
 * tags:
 *   name: Hashtags
 *   description: Hashtag management
 */

/**
 * @openapi
 * /hashtags:
 *   get:
 *     summary: Retrieve all hashtags
 *     tags: [Hashtags]
 *     description: Get all hashtags stored in the database.
 *     responses:
 *       200:
 *         description: A list of hashtags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tweet_id:
 *                     type: integer
 *                     description: The ID of the tweet containing the hashtag
 *                   text:
 *                     type: string
 *                     description: The text of the hashtag
 *                   indices:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: The indices of the hashtag in the tweet text
 *       500:
 *         description: Internal server error
 */
router.get('/', hashtagController.getAllHashtags);

/**
 * @openapi
 * /hashtags/{tweet_id}/{text}:
 *   get:
 *     summary: Retrieve a specific hashtag
 *     tags: [Hashtags]
 *     description: Get a specific hashtag by tweet ID and hashtag text.
 *     parameters:
 *       - in: path
 *         name: tweet_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tweet
 *       - in: path
 *         name: text
 *         required: true
 *         schema:
 *           type: string
 *         description: The text of the hashtag
 *     responses:
 *       200:
 *         description: The requested hashtag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tweet_id:
 *                   type: integer
 *                   description: The ID of the tweet containing the hashtag
 *                 text:
 *                   type: string
 *                   description: The text of the hashtag
 *                 indices:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: The indices of the hashtag in the tweet text
 *       404:
 *         description: Hashtag not found
 *       500:
 *         description: Internal server error
 */
router.get('/:tweet_id/:text', hashtagController.getHashtag);

/**
 * @openapi
 * /hashtags/tweet/{tweet_id}:
 *   get:
 *     summary: Retrieve hashtags by tweet ID
 *     tags: [Hashtags]
 *     description: Get all hashtags associated with a specific tweet.
 *     parameters:
 *       - in: path
 *         name: tweet_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tweet
 *     responses:
 *       200:
 *         description: A list of hashtags for the specified tweet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tweet_id:
 *                     type: integer
 *                     description: The ID of the tweet containing the hashtag
 *                   text:
 *                     type: string
 *                     description: The text of the hashtag
 *                   indices:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: The indices of the hashtag in the tweet text
 *       500:
 *         description: Internal server error
 */
router.get('/tweet/:tweet_id', hashtagController.getHashtagsByTweetId);

/**
 * @openapi
 * /hashtags/search:
 *   get:
 *     summary: Search hashtags with pagination
 *     tags: [Hashtags]
 *     description: Search hashtags by text with pagination support.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query for hashtags
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
 *         description: The number of hashtags to retrieve per page
 *     responses:
 *       200:
 *         description: A paginated list of hashtags matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hashtags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tweet_id:
 *                         type: integer
 *                         description: The ID of the tweet containing the hashtag
 *                       text:
 *                         type: string
 *                         description: The text of the hashtag
 *                       indices:
 *                         type: array
 *                         items:
 *                           type: integer
 *                         description: The indices of the hashtag in the tweet text
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages
 *                 totalHashtags:
 *                   type: integer
 *                   description: The total number of hashtags matching the search query
 *       500:
 *         description: Internal server error
 */
router.get('/search', hashtagController.searchHashtags);

module.exports = router;