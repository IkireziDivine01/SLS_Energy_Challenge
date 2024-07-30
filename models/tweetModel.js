const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Assuming db.js sets up Sequelize
const User = require('./userModel');

const Tweet = sequelize.define('Tweet', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_str: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    text: DataTypes.TEXT,
    source: DataTypes.STRING(255),
    truncated: DataTypes.BOOLEAN,
    in_reply_to_status_id: DataTypes.BIGINT,
    in_reply_to_status_id_str: DataTypes.STRING(20),
    in_reply_to_user_id: DataTypes.BIGINT,
    in_reply_to_user_id_str: DataTypes.STRING(20),
    in_reply_to_screen_name: DataTypes.STRING(50),
    user_id: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: 'id'
        }
    },
    created_at: DataTypes.DATE,
    geo: DataTypes.JSONB,
    coordinates: DataTypes.JSONB,
    place: DataTypes.JSONB,
    contributors: DataTypes.JSONB,
    retweet_count: DataTypes.INTEGER,
    favorite_count: DataTypes.INTEGER,
    favorited: DataTypes.BOOLEAN,
    retweeted: DataTypes.BOOLEAN,
    possibly_sensitive: DataTypes.BOOLEAN,
    filter_level: DataTypes.STRING(50),
    lang: DataTypes.STRING(5)
}, {
    timestamps: false,
    tableName: 'tweets'
});

// Define the association
Tweet.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Tweet, { foreignKey: 'user_id' });

module.exports = Tweet;