var express = require('express');
var app = express();

app.set('port', process.env.PORT || 80);
app.use(express.static('static'));

app.get('*', function(req, res) {
  res.sendFile('html/index.html', {root: 'static'});
});

app.listen(app.get('port'), function() {
  console.log('server listening on port ' + app.get('port'));
});
