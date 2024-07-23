// Example with Sequelize ORM

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Assuming db.js sets up Sequelize

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    id_str: DataTypes.STRING,
    name: DataTypes.STRING,
    screen_name: DataTypes.STRING,
    location: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING,
    protected: DataTypes.BOOLEAN,
    followers_count: DataTypes.INTEGER,
    friends_count: DataTypes.INTEGER,
    listed_count: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    favourites_count: DataTypes.INTEGER,
    utc_offset: DataTypes.INTEGER,
    time_zone: DataTypes.STRING,
    geo_enabled: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    statuses_count: DataTypes.INTEGER,
    lang: DataTypes.STRING,
    contributors_enabled: DataTypes.BOOLEAN,
    is_translator: DataTypes.BOOLEAN,
    is_translation_enabled: DataTypes.BOOLEAN,
    profile_background_color: DataTypes.STRING,
    profile_background_image_url: DataTypes.STRING,
    profile_background_image_url_https: DataTypes.STRING,
    profile_background_tile: DataTypes.BOOLEAN,
    profile_image_url: DataTypes.STRING,
    profile_image_url_https: DataTypes.STRING,
    profile_link_color: DataTypes.STRING,
    profile_sidebar_border_color: DataTypes.STRING,
    profile_sidebar_fill_color: DataTypes.STRING,
    profile_text_color: DataTypes.STRING,
    profile_use_background_image: DataTypes.BOOLEAN,
    default_profile: DataTypes.BOOLEAN,
    default_profile_image: DataTypes.BOOLEAN,
    following: DataTypes.BOOLEAN,
    follow_request_sent: DataTypes.BOOLEAN,
    notifications: DataTypes.BOOLEAN
}, {
    timestamps: false,
    tableName: 'users'
});

module.exports = User;
