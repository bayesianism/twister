/* tweetCollector.js: records a random sampling of recent tweets */

var dotenv = require('dotenv');
var Twit = require('twit');
var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;

// harvest secrets from the environment
dotenv.load();

// feed the secrets into the API client
var T = new Twit({consumer_key: process.env.CONSUMER_KEY,
                  consumer_secret: process.env.CONSUMER_SECRET,
                  access_token: process.env.ACCESS_TOKEN,
                  access_token_secret: process.env.ACCESS_TOKEN_SECRET});

// navigate to the tweet collection in our database
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('twister', server, {safe:true});
var tweets = db.collection('collectedTweets');

// connect to the DB, and...
db.open(function(err,db) {
    if (err) return console.err(err);
    // stream a random sampling of recent tweets and insert each into the DB.
    T.stream('statuses/sample').on('tweet', function(tweet) {
        tweets.insert(tweet, {safe:true}, function(err,doc) {
            if (err) return console.err(err);
        });
    });
});
