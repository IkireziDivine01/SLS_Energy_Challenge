CREATE TABLE users (
    id bigint PRIMARY KEY,
    id_str varchar(500) NOT NULL,
    name varchar(500),
    screen_name text,
    location text,
    url text,
    description text,
    protected boolean,
    followers_count integer,
    friends_count integer,
    listed_count integer,
    created_at timestamp without time zone,
    favourites_count integer,
    utc_offset integer,
    time_zone text,
    geo_enabled boolean,
    verified boolean,
    statuses_count integer,
    lang text,
    contributors_enabled boolean,
    is_translator boolean,
    is_translation_enabled boolean,
    profile_background_color text,
    profile_background_image_url text,
    profile_background_image_url_https text,
    profile_background_tile boolean,
    profile_image_url text,
    profile_image_url_https text,
    profile_link_color text,
    profile_sidebar_border_color text,
    profile_sidebar_fill_color text,
    profile_text_color text,
    profile_use_background_image boolean,
    default_profile boolean,
    default_profile_image boolean,
    following boolean,
    follow_request_sent boolean,
    notifications boolean
);

CREATE TABLE tweets (
    id bigint PRIMARY KEY,
    id_str varchar(20) NOT NULL,
    text text,
    source varchar(255),
    truncated boolean,
    in_reply_to_status_id bigint,
    in_reply_to_status_id_str varchar(20),
    in_reply_to_user_id bigint,
    in_reply_to_user_id_str varchar(20),
    in_reply_to_screen_name varchar(50),
    user_id bigint REFERENCES users(id),
    created_at timestamp without time zone,
    geo jsonb,
    coordinates jsonb,
    place jsonb,
    contributors jsonb,
    retweet_count integer,
    favorite_count integer,
    favorited boolean,
    retweeted boolean,
    possibly_sensitive boolean,
    filter_level varchar(50),
    lang varchar(5)
);

CREATE TABLE hashtags (
    tweet_id bigint NOT NULL REFERENCES tweets(id),
    text text NOT NULL,
    indices integer[],
    PRIMARY KEY (tweet_id, text)
);

CREATE TABLE urls (
    tweet_id bigint NOT NULL REFERENCES tweets(id),
    url text NOT NULL,
    expanded_url text,
    display_url text,
    indices integer[],
    PRIMARY KEY (tweet_id, url)
);

CREATE TABLE user_mentions (
    tweet_id bigint NOT NULL REFERENCES tweets(id),
    screen_name text,
    name varchar(500),
    id bigint NOT NULL,
    id_str varchar(500),
    indices integer[],
    PRIMARY KEY (tweet_id, id)
);
