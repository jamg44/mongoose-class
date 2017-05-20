'use strict';

let mongoose = require('mongoose');
let conn = mongoose.connection;
mongoose.Promise = global.Promise;

const MongodbConnectionUri = 'mongodb://localhost/mongooseClassTest';

conn.on('error', function(err) {
    console.error('mongodb connection error:', err);
    process.exit(1);
});

conn.once('open', function() {
    console.info('Connected to Mongodb.');
});

console.log(`Connecting to ${MongodbConnectionUri} ...`);

mongoose.connect(MongodbConnectionUri);

module.exports.conn = conn;
