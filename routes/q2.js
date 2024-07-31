const express = require('express');
const router = express.Router();
const q2Controller = require('../controllers/q2Controller')
/**
 * @openapi
 * /q2:
 *   get:
 *     summary: Retrieve tweets based on interaction, hashtag, and keyword scoring
 *     tags: [Q2]
 *     description: Get tweets based on interaction with a user, hashtag frequency, and keyword matching. Results are scored and sorted by the calculated score.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to find interactions with.
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [reply, retweet, both]
 *         description: The type of interaction to filter tweets by.
 *       - in: query
 *         name: phrase
 *         required: true
 *         schema:
 *           type: string
 *         description: The phrase to match in the tweet text for scoring.
 *       - in: query
 *         name: hashtag
 *         required: true
 *         schema:
 *           type: string
 *         description: The hashtag to match in the tweet's hashtags for scoring.
 *     responses:
 *       200:
 *         description: A formatted list of scored tweets
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: |
 *                 YourTeamID,YourAWSAccountID
 *                 user_id_1 screen_name_1 description_1 contact_tweet_text_1 score_1
 *                 user_id_2 screen_name_2 description_2 contact_tweet_text_2 score_2
 *                 ...
 *       400:
 *         description: Bad request due to missing or invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/', q2Controller.handleQ2)

module.exports = router;