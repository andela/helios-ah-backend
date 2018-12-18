import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

passport
  .use(new FacebookStrategy({
    clientID: process.env.facebook_app_id,
    clientSecret: process.env.facebook_app_secret,
    callbackURL: process.env.facebook_app_callback,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile)));

passport
  .use(new TwitterStrategy({
    consumerKey: process.env.twitter_app_id,
    consumerSecret: process.env.twitter_app_secret,
    callbackURL: process.env.twitter_app_callback,
    proxy: true,
  },
  (token, tokenSecret, profile, cb) => cb(null, profile)));

passport
  .use(new GoogleStrategy({
    clientID: process.env.google_app_id,
    clientSecret: process.env.google_app_secret,
    callbackURL: process.env.google_app_callback,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile)));
