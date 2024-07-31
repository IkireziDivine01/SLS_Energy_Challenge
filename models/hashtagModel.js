const pool = require('../db');

exports.handleQ2 = async (req, res) => {
    const { user_id, type, phrase, hashtag } = req.query;

    try {
        if (!user_id || !type || !phrase || !hashtag) {
            return res.status(400).send('Missing required query parameters');
        }

        const decodedPhrase = decodeURIComponent(phrase);
        const decodedHashtag = decodeURIComponent(hashtag);

        let query;
        const queryParams = [user_id];
        const allowedLanguages = ['ar', 'en', 'fr', 'in', 'pt', 'es', 'tr', 'ja'];

        const baseQuery = `
            SELECT t.*, u.screen_name, u.description, 
                   array_agg(h.text) as hashtags,
                   COUNT(DISTINCT h.id) as hashtag_count
            FROM tweets t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN hashtag h ON t.id = h.tweet_id
        `;

        if (type === 'reply') {
            query = `
                ${baseQuery}
                WHERE t.in_reply_to_user_id = $1
                AND t.lang = ANY($2)
                GROUP BY t.id, u.screen_name, u.description
            `;
            queryParams.push(allowedLanguages);
        } else if (type === 'retweet') {
            query = `
                ${baseQuery}
                WHERE t.retweeted_status IS NOT NULL
                AND t.lang = ANY($1)
                GROUP BY t.id, u.screen_name, u.description
            `;
            queryParams[0] = allowedLanguages;
        } else if (type === 'both') {
            query = `
                ${baseQuery}
                WHERE (t.in_reply_to_user_id = $1 OR t.retweeted_status IS NOT NULL)
                AND t.lang = ANY($2)
                GROUP BY t.id, u.screen_name, u.description
            `;
            queryParams.push(allowedLanguages);
        } else {
            return res.status(400).send('Invalid type parameter');
        }

        const result = await pool.query(query, queryParams);

        const results = [];
        for (const tweet of result.rows) {
            const interactionScore = calculateInteractionScore(tweet, result.rows);
            const hashtagScore = calculateHashtagScore(tweet, decodedHashtag);
            const keywordScore = calculateKeywordScore(tweet, decodedPhrase, decodedHashtag);

            const finalScore = interactionScore * hashtagScore * keywordScore;

            if (finalScore > 0) {
                results.push({
                    user_id: tweet.user_id,
                    screen_name: tweet.screen_name,
                    description: tweet.description,
                    contact_tweet_text: tweet.text,
                    score: finalScore
                });
            }
        }

        results.sort((a, b) => b.score - a.score || b.user_id - a.user_id);
        const response = results.map(result => (
            `${result.user_id}\t${result.screen_name}\t${result.description}\t${result.contact_tweet_text}`
        )).join('\n');

        res.send(`YourTeamID,YourAWSAccountID\n${response}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

function calculateInteractionScore(tweet, allTweets) {
    let interactionScore = 0;
    allTweets.forEach(otherTweet => {
        if (otherTweet.in_reply_to_status_id === tweet.id) {
            interactionScore += 1;
        }
        if (otherTweet.retweeted_status && otherTweet.retweeted_status === tweet.id) {
            interactionScore += 1;
        }
    });
    return interactionScore;
}

function calculateHashtagScore(tweet, decodedHashtag) {
    let hashtagScore = 0;
    if (tweet.hashtags && tweet.hashtags.includes(decodedHashtag)) {
        hashtagScore += 1;
    }
    return hashtagScore;
}

function calculateKeywordScore(tweet, decodedPhrase, decodedHashtag) {
    let keywordScore = 0;
    if (tweet.text.includes(decodedPhrase)) {
        keywordScore += 1;
    }
    if (tweet.hashtags && tweet.hashtags.includes(decodedHashtag)) {
        keywordScore += 1;
    }
    return keywordScore;
}