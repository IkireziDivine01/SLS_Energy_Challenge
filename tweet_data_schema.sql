-- Enable UUID extension if you want to use UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tweets table
CREATE TABLE tweets (
    tweet_id BIGINT PRIMARY KEY,
    user_id BIGINT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    lang VARCHAR(10),
    reply_to_tweet_id BIGINT,
    retweet_count INT,
    favorite_count INT,
    json_data JSONB,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Users table
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    screen_name VARCHAR(255),
    description TEXT,
    followers_count INT,
    friends_count INT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    json_data JSONB
);

-- Hashtags table
CREATE TABLE hashtags (
    hashtag_id SERIAL PRIMARY KEY,
    hashtag VARCHAR(280)
);

-- Tweet-Hashtag relationship table
CREATE TABLE tweet_hashtags (
    tweet_id BIGINT,
    hashtag_id INT,
    PRIMARY KEY (tweet_id, hashtag_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    FOREIGN KEY (hashtag_id) REFERENCES hashtags(hashtag_id)
);

-- Mentions table
CREATE TABLE mentions (
    tweet_id BIGINT,
    mentioned_user_id BIGINT,
    PRIMARY KEY (tweet_id, mentioned_user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    FOREIGN KEY (mentioned_user_id) REFERENCES users(user_id)
);

-- URLs table
CREATE TABLE urls (
    url_id SERIAL PRIMARY KEY,
    tweet_id BIGINT,
    url TEXT,
    expanded_url TEXT,
    display_url TEXT,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);

-- Media table
CREATE TABLE media (
    media_id BIGINT PRIMARY KEY,
    tweet_id BIGINT,
    media_url TEXT,
    media_type VARCHAR(50),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_tweets_created_at ON tweets(created_at);
CREATE INDEX idx_tweets_user_id ON tweets(user_id);
CREATE INDEX idx_users_screen_name ON users(screen_name);
CREATE INDEX idx_hashtags_hashtag ON hashtags(hashtag);