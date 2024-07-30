const express = require('express');
const router = express.Router();

// Import the models
const User = require('../models/userModel');
const Tweet = require('../models/tweetModel');
const Hashtag = require('../models/hashtagModel');
router.get('/q2', async (req, res) => {
    const { user_id, type, phrase, hashtag } = req.query;

    try {
        // Validate input
        if (!user_id || !type || !phrase || !hashtag) {
            return res.status(400).send('Missing required query parameters');
        }

        // Extract and decode parameters
        const decodedPhrase = decodeURIComponent(phrase);
        const decodedHashtag = decodeURIComponent(hashtag);

        // Find relevant tweets
        let contactTweets;
        if (type === 'reply') {
            contactTweets = await Tweet.findAll({
                where: {
                    in_reply_to_user_id: user_id,
                    lang: ['ar', 'en', 'fr', 'in', 'pt', 'es', 'tr', 'ja']
                },
                include: [{ model: User }]
            });
        } else if (type === 'retweet') {
            contactTweets = await Tweet.findAll({
                where: {
                    retweeted_status: {
                        [Op.not]: null
                    },
                    lang: ['ar', 'en', 'fr', 'in', 'pt', 'es', 'tr', 'ja']
                },
                include: [{ model: User }]
            });
        } else if (type === 'both') {
            contactTweets = await Tweet.findAll({
                where: {
                    [Op.or]: [
                        { in_reply_to_user_id: user_id },
                        { retweeted_status: { [Op.not]: null } }
                    ],
                    lang: ['ar', 'en', 'fr', 'in', 'pt', 'es', 'tr', 'ja']
                },
                include: [{ model: User }]
            });
        } else {
            return res.status(400).send('Invalid type parameter');
        }

        // Process the tweets to calculate scores
        const results = [];
        for (const tweet of contactTweets) {
            const user = await User.findByPk(tweet.user_id);

            // Calculate interaction score, hashtag score, and keyword score
            const interactionScore = calculateInteractionScore(tweet);
            const hashtagScore = calculateHashtagScore(tweet, decodedHashtag);
            const keywordScore = calculateKeywordScore(tweet, decodedPhrase);

            const finalScore = interactionScore * hashtagScore * keywordScore;

            if (finalScore > 0) {
                results.push({
                    user_id: user.id,
                    screen_name: user.screen_name,
                    description: user.description,
                    contact_tweet_text: tweet.text,
                    score: finalScore
                });
            }
        }

        // Sort results by score and format response
        results.sort((a, b) => b.score - a.score || b.user_id - a.user_id);
        const response = results.map(result => (
            `${result.user_id}\t${result.screen_name}\t${result.description}\t${result.contact_tweet_text}`
        )).join('\n');

        res.send(`YourTeamID,YourAWSAccountID\n${response}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Functions for scoring
function calculateInteractionScore(tweet, allTweets) {
    let interactionScore = 0;

    // Iterate through all tweets to find interactions with the given tweet
    allTweets.forEach(otherTweet => {
        if (otherTweet.in_reply_to_status_id === tweet.id) {
            interactionScore += 1; // Increase score for replies
        }
        if (otherTweet.retweeted_status && otherTweet.retweeted_status.id === tweet.id) {
            interactionScore += 1; // Increase score for retweets
        }
    });

    return interactionScore;
}


function calculateHashtagScore(tweet, allHashtags) {
    let hashtagScore = 0;

    // Filter out very popular hashtags (e.g., based on a predefined threshold)
    const threshold = 1000; // Example threshold for popularity
    const popularHashtags = allHashtags.filter(hashtag => hashtag.frequency > threshold);

    // Count the number of hashtags in the tweet that are not popular
    tweet.hashtags.forEach(hashtag => {
        if (!popularHashtags.some(popular => popular.text === hashtag)) {
            hashtagScore += 1; // Increase score for less popular hashtags
        }
    });

    return hashtagScore;
}


function calculateKeywordScore(tweet, phrase, hashtag) {
    let keywordScore = 0;

    // Count the number of matches of the phrase in the tweet text
    if (tweet.text.includes(phrase)) {
        keywordScore += 1;
    }

    // Count the number of matches of the hashtag in the tweet's hashtags
    if (tweet.hashtags.includes(hashtag)) {
        keywordScore += 1;
    }

    return keywordScore;
}

