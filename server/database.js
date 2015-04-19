var Promise = require('bluebird');
var mongo = require('mongodb');
Promise.promisifyAll(mongo);
var Server = mongo.Server;
var Db = mongo.Db;

// 'constants'
var _dbName = 'twister';
var _dbSrvr = 'localhost';
var _dbPort = 27017;


// abstract it all away...
module.exports.useDB = function(collection, action, input) {
  var db = new Db(_dbName, new Server(_dbSrvr, _dbPort, {}), {safe: true});
  return db.openAsync()
    .then(getCollection.bind(null,collection))
    .then(action.bind(null,input))
    .then(db.closeAsync.bind(db));
};

function getCollection(collection, db) { return db.collection(collection); }

// some simple possible actions
function insert(document, collection) { return collection.insertAsync(document); }
function search(query, collection) { return collection.find(query).toArrayAsync(); }
