require('dotenv').load();
var express = require('express');
var app = express();
var db = require('./database');

app.set('port', process.env.PORT || 80);
app.use(express.static('static'));

app.get('/data/sample/map', function(req, res) {
  db.useDB('tweets', function(query,collection) {
    return collection.find(query).limit(1000).toArrayAsync()
      .map(function(tweet) { return tweet.geo.coordinates; })
      .then(function(coords) {
        res.json({coordinates: [['latitude', 'longitude']].concat(coords)});
      });
  }, {});
});

app.get('*', function(req, res) {
  res.sendFile('html/index.html', {root: 'static'});
});

app.listen(app.get('port'), function() {
  console.log('server listening on port ' + app.get('port'));
});
