var path = require('path');
var Sequelize = require('sequelize');

require('dotenv').load();

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

var sequelize = new Sequelize(DB_name, user, pwd, {
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage,	// SQLite
	omitNull: true		// PostgreSQL
});

var dirname = path.resolve(path.dirname());

exports.Local = sequelize.import(path.join(dirname, 'models/local.js'));
exports.Google = sequelize.import(path.join(dirname, 'models/google.js'));

sequelize.sync().then(function () {
	console.log('DB initialized');
});
