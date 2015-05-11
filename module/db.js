var  setting = require('../setting');
var  mongodb = require('mongodb');
var  server  = new mongodb.Server(setting.host, 27017, {auto_reconnect:true});
var  db = new mongodb.Db(setting.db, server, {safe:true});
module.exports = db;	