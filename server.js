require('dotenv').load();
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 80);
app.use(express.static('static'));

// super temporary test data
var fakeSampleMap = { coordinates:
  [['latitude', 'longitude'], [51.50964, -0.474985], [52.213882, 0.110751], [52.386765, 4.869757], [13.626867, 123.200633],
   [42.461522, 18.527895], [37.310025, 27.781197], [53.318557, -6.481955], [36.468672, 8.553136], [34.091317, -117.642431], 
   [52.958538, -1.155635], [14.692146, 121.135816], [8.484747, 124.651221], [1.327372, 103.946962], [53.371798, -1.504339], 
   [53.361011, -6.25331], [34.622748, -78.618166], [29.302567, 47.933049], [13.787686, 100.585078]] };

app.get('/data/sample/map', function(req, res) {
  res.json(fakeSampleMap);
});

app.get('*', function(req, res) {
  res.sendFile('html/index.html', {root: 'static'});
});

app.listen(app.get('port'), function() {
  console.log('server listening on port ' + app.get('port'));
});
