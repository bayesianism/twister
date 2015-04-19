require('dotenv').load(); // in here secrets are kept
var Promise = require('bluebird');
var querystring = require('querystring');
var n = require('big-number').n; // javascript can't natively handle twitter ID numbers
var Twit = require('twit');
var db = require('./database');

// 'constants'
var _defaultLimit = 10;
var _queryPageSize = 100;
var _timelinePageSize = 200;
var _cacheAgeLimit = 1000000000;
var _queryTable = 'searches';
var _usersTable = 'users';

// feed the secrets into the API client
var T = new Twit({consumer_key: process.env.CONSUMER_KEY,
                  consumer_secret: process.env.CONSUMER_SECRET,
                  access_token: process.env.ACCESS_TOKEN,
                  access_token_secret: process.env.ACCESS_TOKEN_SECRET});

function TweetCollector() {
  var self = this;
  self.tweets = [];

  self.collect = function() {
    return new Promise(function(resolve, reject) {
      self.checkCache().then(function(foundCache) {
        if (foundCache) return resolve(self.getCache());

        T.get(self.method, self.params(), function(err,data) {
          if (err) return reject(err);
          self.update(data);
          return resolve(self.done ? self.tweets : self.collect());
        });
      });
    });
  };

  self.update = function(data) {
    if ((self.done = self.getDone(data))) return;
    self.addTweets(self.getTweets(data));
    self.maxID = self.getMaxID(data);
  };

  self.limit = self.limit ? Math.min(self.limit, _defaultLimit) : _defaultLimit;
  self.remaining = self.limit;
  self.count = function() { return Math.min(self.remaining, self.pageSize); };
  self.addTweets = function(tweets) {
    self.tweets = self.tweets.concat(tweets);
    self.remaining -= tweets.length;
  };
}

function TimelineCollector(user) {
  var self = this;
  self.checkCache = function() { return Promise.resolve(false); };
  self.handle = user.handle;
  self.pageSize = _timelinePageSize;
  self.limit = user.tweetCount;

  self.method = 'statuses/user_timeline';
  self.params = function() { 
    return {screen_name: self.handle, count: self.count(), max_id: self.maxID};
  };

  self.getTweets = function(data) { return data; };
  self.getDone = function(data) { return !data.length; };
  self.getMaxID = function(data) {
    return n(data[data.length-1].id).minus(1).toString();
  };

  TweetCollector.call(self);
}

function QueryCollector(query) {
  var self = this;
  self.query = query;
  self.pageSize = _queryPageSize;

  self.method = 'search/tweets';
  self.params = function() {
    return {q: self.query, lang: 'en', count: self.count(), result_type: 'recent', max_id: self.maxID};
  };

  self.getDone = function(data) { return !data.search_metadata.next_results; };
  self.getTweets = function(data) { return data.statuses; };
  self.getMaxID = function(data) {
    return querystring.parse(data.search_metadata.next_results.slice(1)).max_id;
  };

  TweetCollector.call(self);

  self.checkCache = function() {
    var pending = Promise.pending();
    db.useDB(_queryTable, function(query, collection) {
      return collection.findOneAsync({query: self.query, cached: {$gt: Date.now()-_cacheAgeLimit}})
        .then(pending.resolve.bind(pending));
    });
    return pending.promise;
  };

}

function UserHarvester(handle) {
  var self = this;

  self.summarize = function() {
    return new Promise(function(resolve, reject) {
      T.get('users/show', {screen_name: handle}, function(err, user) {
        if(err||!user) return reject(err||"user not found: "+handle);
        return resolve({name: user.name,
                        handle: user.screen_name,
                        location: (user.status && user.status.geo) || user.location,
                        created: user.created_at,
                        tweetCount: user.statuses_count,
                        cached: Date.now()});
      });
    });
  };

  self.getTimeline = function(user) {
    return new TimelineCollector(user).collect()
      .then(function(tweets) {
        user.tweets = tweets;
        return user;
      });
  };

  self.construct = function() {
    return self.summarize()
      .then(self.getTimeline);
  };
}
