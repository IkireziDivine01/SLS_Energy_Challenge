const pool = require('../db');  // Adjust the path as needed

exports.handleQ2 = async (req, res) => {
    try {
        const { user_id, type, phrase, hashtag } = req.query;

        console.log('Received parameters:', { user_id, type, phrase, hashtag });

        if (!user_id || !type || !phrase || !hashtag) {
            console.log('Missing required query parameters');
            return res.status(400).send('Missing required query parameters');
        }

        const decodedPhrase = decodeURIComponent(phrase);
        const decodedHashtag = decodeURIComponent(hashtag);

        let query;
        const queryParams = [user_id];
        const allowedLanguages = ['ar', 'en', 'fr', 'in', 'pt', 'es', 'tr', 'ja'];

        if (type === 'reply') {
            query = `
                SELECT t.*, u.screen_name, u.description
                FROM tweets t
                JOIN users u ON t.user_id = u.id
                LEFT JOIN hashtags h ON t.id = h.tweet_id
                WHERE t.in_reply_to_user_id = $1
                AND t.lang = ANY($2)
            `;
            queryParams.push(allowedLanguages);
        } else if (type === 'retweet') {
            query = `
                SELECT t.*, u.screen_name, u.description
                FROM tweets t
                JOIN users u ON t.user_id = u.id
                LEFT JOIN hashtags h ON t.id = h.tweet_id
                WHERE t.retweet_count IS NOT NULL
                AND t.retweet_count > 0
                AND t.lang = ANY($1)
            `;
            queryParams[0] = allowedLanguages;
        } else if (type === 'both') {
            query = `
                SELECT t.*, u.screen_name, u.description
                FROM tweets t
                JOIN users u ON t.user_id = u.id
                LEFT JOIN hashtags h ON t.id = h.tweet_id
                WHERE (t.in_reply_to_user_id = $1 OR t.retweet_count IS NOT NULL AND t.retweet_count > 0)
                AND t.lang = ANY($2)
            `;
            queryParams.push(allowedLanguages);
        } else {
            console.log('Invalid type parameter:', type);
            return res.status(400).send('Invalid type parameter');
        }

        console.log('Executing query:', query);
        console.log('Query parameters:', queryParams);

        const result = await pool.query(query, queryParams);
        console.log(`Query returned ${result.rows.length} rows`);

        const results = [];
        for (const tweet of result.rows) {
            const interactionScore = calculateInteractionScore(tweet, result.rows);
            const hashtagScore = calculateHashtagScore(tweet, decodedHashtag);
            const keywordScore = calculateKeywordScore(tweet, decodedPhrase, decodedHashtag);

            const finalScore = interactionScore * hashtagScore * keywordScore;

            console.log(`Tweet ID: ${tweet.id}, Interaction Score: ${interactionScore}, Hashtag Score: ${hashtagScore}, Keyword Score: ${keywordScore}, Final Score: ${finalScore}`);

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

        console.log(`Processed ${results.length} results with non-zero scores`);

        results.sort((a, b) => b.score - a.score || b.user_id - a.user_id);
        const response = results.map(result => (
            `${result.user_id}\t${result.screen_name}\t${result.description}\t${result.contact_tweet_text}`
        )).join('\n');

        res.send(`YourTeamID,YourAWSAccountID\n${response}`);
    } catch (error) {
        console.error('Error in handleQ2:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
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