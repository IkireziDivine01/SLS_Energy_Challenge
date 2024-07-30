const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Tweet = require('./tweetModel');

const Hashtag = sequelize.define('Hashtag', {
    tweet_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Tweet,
            key: 'id'
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    indices: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'hashtags'
});

// Define the association
Hashtag.belongsTo(Tweet, { foreignKey: 'tweet_id' });
Tweet.hasMany(Hashtag, { foreignKey: 'tweet_id' });

module.exports = Hashtag;