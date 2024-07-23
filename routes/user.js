const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Get all users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the user
 *                   id_str:
 *                     type: string
 *                     description: The unique string identifier of the user
 *                   name:
 *                     type: string
 *                     description: The full name of the user
 *                   screen_name:
 *                     type: string
 *                     description: The screen name (handle) of the user
 *                   location:
 *                     type: string
 *                     description: The location specified by the user
 *                     nullable: true
 *                   url:
 *                     type: string
 *                     description: The URL provided by the user
 *                     nullable: true
 *                   description:
 *                     type: string
 *                     description: The user's profile description
 *                   protected:
 *                     type: boolean
 *                     description: Whether the user's tweets are protected
 *                   followers_count:
 *                     type: integer
 *                     description: The number of followers the user has
 *                   friends_count:
 *                     type: integer
 *                     description: The number of users the user is following
 *                   listed_count:
 *                     type: integer
 *                     description: The number of lists that the user is a member of
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the user account was created
 *                   favourites_count:
 *                     type: integer
 *                     description: The number of tweets the user has liked
 *                   utc_offset:
 *                     type: integer
 *                     description: The user's time zone offset from UTC
 *                     nullable: true
 *                   time_zone:
 *                     type: string
 *                     description: The user's time zone
 *                     nullable: true
 *                   geo_enabled:
 *                     type: boolean
 *                     description: Whether the user has enabled geo-tagging
 *                   verified:
 *                     type: boolean
 *                     description: Whether the user's account is verified
 *                   statuses_count:
 *                     type: integer
 *                     description: The number of tweets the user has posted
 *                   lang:
 *                     type: string
 *                     description: The user's preferred language
 *                   contributors_enabled:
 *                     type: boolean
 *                     description: Whether the user can be a contributor
 *                   is_translator:
 *                     type: boolean
 *                     description: Whether the user is a translator
 *                   is_translation_enabled:
 *                     type: boolean
 *                     description: Whether the user has translation enabled
 *                   profile_background_color:
 *                     type: string
 *                     description: The background color of the user's profile
 *                   profile_background_image_url:
 *                     type: string
 *                     description: The URL of the background image of the user's profile
 *                   profile_background_image_url_https:
 *                     type: string
 *                     description: The secure URL of the background image of the user's profile
 *                   profile_background_tile:
 *                     type: boolean
 *                     description: Whether the background image is tiled
 *                   profile_image_url:
 *                     type: string
 *                     description: The URL of the user's profile image
 *                   profile_image_url_https:
 *                     type: string
 *                     description: The secure URL of the user's profile image
 *                   profile_link_color:
 *                     type: string
 *                     description: The color used for links on the user's profile
 *                   profile_sidebar_border_color:
 *                     type: string
 *                     description: The border color of the profile sidebar
 *                   profile_sidebar_fill_color:
 *                     type: string
 *                     description: The fill color of the profile sidebar
 *                   profile_text_color:
 *                     type: string
 *                     description: The text color used on the user's profile
 *                   profile_use_background_image:
 *                     type: boolean
 *                     description: Whether the user uses a background image
 *                   default_profile:
 *                     type: boolean
 *                     description: Whether the user's profile is the default profile
 *                   default_profile_image:
 *                     type: boolean
 *                     description: Whether the user's profile image is the default image
 *                   following:
 *                     type: boolean
 *                     description: Whether the authenticated user is following this user
 *                     nullable: true
 *                   follow_request_sent:
 *                     type: boolean
 *                     description: Whether a follow request has been sent
 *                     nullable: true
 *                   notifications:
 *                     type: boolean
 *                     description: Whether the user has enabled notifications
 *                     nullable: true
 *       500:
 *         description: Internal server error
 */
router.get('/', userController.getAllUsers);

/**
 * @openapi
 * /users/search:
 *   get:
 *     summary: Retrieve users by name
 *     description: Search users by name with optional fuzzy matching.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *           example: John Doe
 *         description: Filter users by name. Use partial matches for fuzzy search.
 *     responses:
 *       200:
 *         description: A list of users matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the user
 *                   id_str:
 *                     type: string
 *                     description: The unique string identifier of the user
 *                   name:
 *                     type: string
 *                     description: The full name of the user
 *                   screen_name:
 *                     type: string
 *                     description: The screen name (handle) of the user
 *                   location:
 *                     type: string
 *                     description: The location specified by the user
 *                     nullable: true
 *                   url:
 *                     type: string
 *                     description: The URL provided by the user
 *                     nullable: true
 *                   description:
 *                     type: string
 *                     description: The user's profile description
 *                   protected:
 *                     type: boolean
 *                     description: Whether the user's tweets are protected
 *                   followers_count:
 *                     type: integer
 *                     description: The number of followers the user has
 *                   friends_count:
 *                     type: integer
 *                     description: The number of users the user is following
 *                   listed_count:
 *                     type: integer
 *                     description: The number of lists that the user is a member of
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the user account was created
 *                   favourites_count:
 *                     type: integer
 *                     description: The number of tweets the user has liked
 *                   utc_offset:
 *                     type: integer
 *                     description: The user's time zone offset from UTC
 *                     nullable: true
 *                   time_zone:
 *                     type: string
 *                     description: The user's time zone
 *                     nullable: true
 *                   geo_enabled:
 *                     type: boolean
 *                     description: Whether the user has enabled geo-tagging
 *                   verified:
 *                     type: boolean
 *                     description: Whether the user's account is verified
 *                   statuses_count:
 *                     type: integer
 *                     description: The number of tweets the user has posted
 *                   lang:
 *                     type: string
 *                     description: The user's preferred language
 *                   contributors_enabled:
 *                     type: boolean
 *                     description: Whether the user can be a contributor
 *                   is_translator:
 *                     type: boolean
 *                     description: Whether the user is a translator
 *                   is_translation_enabled:
 *                     type: boolean
 *                     description: Whether the user has translation enabled
 *                   profile_background_color:
 *                     type: string
 *                     description: The background color of the user's profile
 *                   profile_background_image_url:
 *                     type: string
 *                     description: The URL of the background image of the user's profile
 *                   profile_background_image_url_https:
 *                     type: string
 *                     description: The secure URL of the background image of the user's profile
 *                   profile_background_tile:
 *                     type: boolean
 *                     description: Whether the background image is tiled
 *                   profile_image_url:
 *                     type: string
 *                     description: The URL of the user's profile image
 *                   profile_image_url_https:
 *                     type: string
 *                     description: The secure URL of the user's profile image
 *                   profile_link_color:
 *                     type: string
 *                     description: The color used for links on the user's profile
 *                   profile_sidebar_border_color:
 *                     type: string
 *                     description: The border color of the profile sidebar
 *                   profile_sidebar_fill_color:
 *                     type: string
 *                     description: The fill color of the profile sidebar
 *                   profile_text_color:
 *                     type: string
 *                     description: The text color used on the user's profile
 *                   profile_use_background_image:
 *                     type: boolean
 *                     description: Whether the user uses a background image
 *                   default_profile:
 *                     type: boolean
 *                     description: Whether the user's profile is the default profile
 *                   default_profile_image:
 *                     type: boolean
 *                     description: Whether the user's profile image is the default image
 *       500:
 *         description: Internal server error
 */
router.get('/search', userController.getUsersByName);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Get a specific user by their unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: The user matching the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the user
 *                 id_str:
 *                   type: string
 *                   description: The unique string identifier of the user
 *                 name:
 *                   type: string
 *                   description: The full name of the user
 *                 screen_name:
 *                   type: string
 *                   description: The screen name (handle) of the user
 *                 location:
 *                   type: string
 *                   description: The location specified by the user
 *                   nullable: true
 *                 url:
 *                   type: string
 *                   description: The URL provided by the user
 *                   nullable: true
 *                 description:
 *                   type: string
 *                   description: The user's profile description
 *                 protected:
 *                   type: boolean
 *                   description: Whether the user's tweets are protected
 *                 followers_count:
 *                   type: integer
 *                   description: The number of followers the user has
 *                 friends_count:
 *                   type: integer
 *                   description: The number of users the user is following
 *                 listed_count:
 *                   type: integer
 *                   description: The number of lists that the user is a member of
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the user account was created
 *                 favourites_count:
 *                   type: integer
 *                   description: The number of tweets the user has liked
 *                 utc_offset:
 *                   type: integer
 *                   description: The user's time zone offset from UTC
 *                   nullable: true
 *                 time_zone:
 *                   type: string
 *                   description: The user's time zone
 *                   nullable: true
 *                 geo_enabled:
 *                   type: boolean
 *                   description: Whether the user has enabled geo-tagging
 *                 verified:
 *                   type: boolean
 *                   description: Whether the user's account is verified
 *                 statuses_count:
 *                   type: integer
 *                   description: The number of tweets the user has posted
 *                 lang:
 *                   type: string
 *                   description: The user's preferred language
 *                 contributors_enabled:
 *                   type: boolean
 *                   description: Whether the user can be a contributor
 *                 is_translator:
 *                   type: boolean
 *                   description: Whether the user is a translator
 *                 is_translation_enabled:
 *                   type: boolean
 *                   description: Whether the user has translation enabled
 *                 profile_background_color:
 *                   type: string
 *                   description: The background color of the user's profile
 *                 profile_background_image_url:
 *                   type: string
 *                   description: The URL of the background image of the user's profile
 *                 profile_background_image_url_https:
 *                   type: string
 *                   description: The secure URL of the background image of the user's profile
 *                 profile_background_tile:
 *                   type: boolean
 *                   description: Whether the background image is tiled
 *                 profile_image_url:
 *                   type: string
 *                   description: The URL of the user's profile image
 *                 profile_image_url_https:
 *                   type: string
 *                   description: The secure URL of the user's profile image
 *                 profile_link_color:
 *                   type: string
 *                   description: The color used for links on the user's profile
 *                 profile_sidebar_border_color:
 *                   type: string
 *                   description: The border color of the profile sidebar
 *                 profile_sidebar_fill_color:
 *                   type: string
 *                   description: The fill color of the profile sidebar
 *                 profile_text_color:
 *                   type: string
 *                   description: The text color used on the user's profile
 *                 profile_use_background_image:
 *                   type: boolean
 *                   description: Whether the user uses a background image
 *                 default_profile:
 *                   type: boolean
 *                   description: Whether the user's profile is the default profile
 *                 default_profile_image:
 *                   type: boolean
 *                   description: Whether the user's profile image is the default image
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', userController.getUserById);

module.exports = router;
