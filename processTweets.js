const fs = require('fs');
const readline = require('readline');
const { Pool } = require('pg');
const path = require('path');

async function processTweets(inputFile1, inputFile2, outputFile) {
    const seenTweets = new Map();
    const writeStream = fs.createWriteStream(outputFile);

    writeStream.on('error', (error) => {
        console.error('Error writing to file:', error);
    });

    async function processFile(filePath) {
        const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
    
        let lineNumber = 0;
    
        for await (const line of rl) {
            lineNumber++;
            let tweet;
    
            try {
                tweet = JSON.parse(line.trim());
            } catch (error) {
                console.log(`Line ${lineNumber} is not valid JSON: ${line.substring(0, 50)}...`);
                continue;
            }
    
            if (!tweet || typeof tweet !== 'object' || !tweet.id || !tweet.text || !tweet.user || !tweet.created_at) {
                console.log(`Line ${lineNumber} is not a valid tweet object: ${JSON.stringify(tweet).substring(0, 50)}...`);
                continue;
            }
    
            const tweetId = tweet.id_str;
            if (!seenTweets.has(tweetId)) {
                seenTweets.set(tweetId, true);
                writeStream.write(JSON.stringify(tweet) + '\n');
    
                if (seenTweets.size > 1000000) {
                    const firstKey = seenTweets.keys().next().value;
                    seenTweets.delete(firstKey);
                }
            }
        }
    }

    await processFile(inputFile1);
    await processFile(inputFile2);

    writeStream.end();
    console.log('Processing complete. JSON file created.');
}

async function insertTweetsFromJSON(jsonFile) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'twitter_db',
        password: 'divine@123',
        port: 5432,
    });

    const fileStream = fs.createReadStream(jsonFile, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const batchSize = 1000;
    let tweets = [];
    let users = new Map();
    let hashtags = [];
    let urls = [];
    let userMentions = [];

    for await (const line of rl) {
        const tweet = JSON.parse(line);

        // Process user data
        const user = tweet.user;
        users.set(user.id_str, {
            id: user.id,
            id_str: user.id_str,
            name: user.name,
            screen_name: user.screen_name,
            location: user.location,
            url: user.url,
            description: user.description,
            protected: user.protected,
            followers_count: user.followers_count,
            friends_count: user.friends_count,
            listed_count: user.listed_count,
            created_at: new Date(user.created_at),
            favourites_count: user.favourites_count,
            utc_offset: user.utc_offset,
            time_zone: user.time_zone,
            geo_enabled: user.geo_enabled,
            verified: user.verified,
            statuses_count: user.statuses_count,
            lang: user.lang,
            contributors_enabled: user.contributors_enabled,
            is_translator: user.is_translator,
            is_translation_enabled: user.is_translation_enabled,
            profile_background_color: user.profile_background_color,
            profile_background_image_url: user.profile_background_image_url,
            profile_background_image_url_https: user.profile_background_image_url_https,
            profile_background_tile: user.profile_background_tile,
            profile_image_url: user.profile_image_url,
            profile_image_url_https: user.profile_image_url_https,
            profile_link_color: user.profile_link_color,
            profile_sidebar_border_color: user.profile_sidebar_border_color,
            profile_sidebar_fill_color: user.profile_sidebar_fill_color,
            profile_text_color: user.profile_text_color,
            profile_use_background_image: user.profile_use_background_image,
            default_profile: user.default_profile,
            default_profile_image: user.default_profile_image,
            following: user.following,
            follow_request_sent: user.follow_request_sent,
            notifications: user.notifications
        });

        // Process tweet data
        tweets.push({
            id: tweet.id,
            id_str: tweet.id_str,
            text: tweet.text,
            source: tweet.source,
            truncated: tweet.truncated,
            in_reply_to_status_id: tweet.in_reply_to_status_id,
            in_reply_to_status_id_str: tweet.in_reply_to_status_id_str,
            in_reply_to_user_id: tweet.in_reply_to_user_id,
            in_reply_to_user_id_str: tweet.in_reply_to_user_id_str,
            in_reply_to_screen_name: tweet.in_reply_to_screen_name,
            user_id: tweet.user.id,
            created_at: new Date(tweet.created_at),
            geo: tweet.geo,
            coordinates: tweet.coordinates,
            place: tweet.place,
            contributors: tweet.contributors,
            retweet_count: tweet.retweet_count,
            favorite_count: tweet.favorite_count,
            favorited: tweet.favorited,
            retweeted: tweet.retweeted,
            possibly_sensitive: tweet.possibly_sensitive,
            filter_level: tweet.filter_level,
            lang: tweet.lang
        });

        // Process hashtags
        if (tweet.entities && tweet.entities.hashtags) {
            tweet.entities.hashtags.forEach(hashtag => {
                hashtags.push({
                    tweet_id: tweet.id,
                    text: hashtag.text,
                    indices: hashtag.indices
                });
            });
        }

        // Process URLs
        if (tweet.entities && tweet.entities.urls) {
            tweet.entities.urls.forEach(url => {
                urls.push({
                    tweet_id: tweet.id,
                    url: url.url,
                    expanded_url: url.expanded_url,
                    display_url: url.display_url,
                    indices: url.indices
                });
            });
        }

        // Process user mentions
        if (tweet.entities && tweet.entities.user_mentions) {
            tweet.entities.user_mentions.forEach(mention => {
                userMentions.push({
                    tweet_id: tweet.id,
                    screen_name: mention.screen_name,
                    name: mention.name,
                    id: mention.id,
                    id_str: mention.id_str,
                    indices: mention.indices
                });
            });
        }

        if (tweets.length >= batchSize) {
            await batchInsert(pool, tweets, users, hashtags, urls, userMentions);
            tweets = [];
            users = new Map();
            hashtags = [];
            urls = [];
            userMentions = [];
        }
    }

    // Insert any remaining data
    if (tweets.length > 0) {
        await batchInsert(pool, tweets, users, hashtags, urls, userMentions);
    }

    await pool.end();
    console.log('Database insertion complete.');
}

async function batchInsert(pool, tweets, users, hashtags, urls, userMentions) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert users
        if (users.size > 0) {
            const userQuery = `
                INSERT INTO users (id, id_str, name, screen_name, location, url, description, protected, 
                followers_count, friends_count, listed_count, created_at, favourites_count, utc_offset, 
                time_zone, geo_enabled, verified, statuses_count, lang, contributors_enabled, is_translator, 
                is_translation_enabled, profile_background_color, profile_background_image_url, 
                profile_background_image_url_https, profile_background_tile, profile_image_url, 
                profile_image_url_https, profile_link_color, profile_sidebar_border_color, 
                profile_sidebar_fill_color, profile_text_color, profile_use_background_image, 
                default_profile, default_profile_image, following, follow_request_sent, notifications)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
                $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
                ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                screen_name = EXCLUDED.screen_name,
                location = EXCLUDED.location,
                url = EXCLUDED.url,
                description = EXCLUDED.description,
                protected = EXCLUDED.protected,
                followers_count = EXCLUDED.followers_count,
                friends_count = EXCLUDED.friends_count,
                listed_count = EXCLUDED.listed_count,
                favourites_count = EXCLUDED.favourites_count,
                utc_offset = EXCLUDED.utc_offset,
                time_zone = EXCLUDED.time_zone,
                geo_enabled = EXCLUDED.geo_enabled,
                verified = EXCLUDED.verified,
                statuses_count = EXCLUDED.statuses_count,
                lang = EXCLUDED.lang,
                contributors_enabled = EXCLUDED.contributors_enabled,
                is_translator = EXCLUDED.is_translator,
                is_translation_enabled = EXCLUDED.is_translation_enabled,
                profile_background_color = EXCLUDED.profile_background_color,
                profile_background_image_url = EXCLUDED.profile_background_image_url,
                profile_background_image_url_https = EXCLUDED.profile_background_image_url_https,
                profile_background_tile = EXCLUDED.profile_background_tile,
                profile_image_url = EXCLUDED.profile_image_url,
                profile_image_url_https = EXCLUDED.profile_image_url_https,
                profile_link_color = EXCLUDED.profile_link_color,
                profile_sidebar_border_color = EXCLUDED.profile_sidebar_border_color,
                profile_sidebar_fill_color = EXCLUDED.profile_sidebar_fill_color,
                profile_text_color = EXCLUDED.profile_text_color,
                profile_use_background_image = EXCLUDED.profile_use_background_image,
                default_profile = EXCLUDED.default_profile,
                default_profile_image = EXCLUDED.default_profile_image,
                following = EXCLUDED.following,
                follow_request_sent = EXCLUDED.follow_request_sent,
                notifications = EXCLUDED.notifications
            `;
            await Promise.all(Array.from(users.values()).map(user => 
                client.query(userQuery, Object.values(user))
            ));
        }

        // Insert tweets
        const tweetQuery = `
            INSERT INTO tweets (id, id_str, text, source, truncated, in_reply_to_status_id, 
            in_reply_to_status_id_str, in_reply_to_user_id, in_reply_to_user_id_str, 
            in_reply_to_screen_name, user_id, created_at, geo, coordinates, place, contributors, 
            retweet_count, favorite_count, favorited, retweeted, possibly_sensitive, filter_level, lang)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            ON CONFLICT (id) DO NOTHING
        `;
        await Promise.all(tweets.map(tweet => 
            client.query(tweetQuery, Object.values(tweet))
        ));

        // Insert hashtags
        if (hashtags.length > 0) {
            const hashtagQuery = `
                INSERT INTO hashtags (tweet_id, text, indices)
                VALUES ($1, $2, $3)
                ON CONFLICT (tweet_id, text) DO NOTHING
            `;
            await Promise.all(hashtags.map(hashtag => 
                client.query(hashtagQuery, [hashtag.tweet_id, hashtag.text, hashtag.indices])
            ));
        }

        // Insert URLs
        if (urls.length > 0) {
            const urlQuery = `
                INSERT INTO urls (tweet_id, url, expanded_url, display_url, indices)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (tweet_id, url) DO NOTHING
            `;
            await Promise.all(urls.map(url => 
                client.query(urlQuery, [url.tweet_id, url.url, url.expanded_url, url.display_url, url.indices])
            ));
        }

        // Insert user mentions
        if (userMentions.length > 0) {
            const mentionQuery = `
                INSERT INTO user_mentions (tweet_id, screen_name, name, id, id_str, indices)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (tweet_id, id) DO NOTHING
            `;
            await Promise.all(userMentions.map(mention => 
                client.query(mentionQuery, [mention.tweet_id, mention.screen_name, mention.name, mention.id, mention.id_str, mention.indices])
            ));
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in batch insert:', error);
    } finally {
        client.release();
    }
}

// Usage
const inputFile1 = path.join(__dirname, 'popular_hashtags.txt');
const inputFile2 = path.join(__dirname, 'query2_ref.txt');
const outputFile = path.join(__dirname, 'filtered_tweets.jsonl');

processTweets(inputFile1, inputFile2, outputFile)
    .then(() => insertTweetsFromJSON(outputFile))
    .catch(error => console.error('An error occurred:', error));