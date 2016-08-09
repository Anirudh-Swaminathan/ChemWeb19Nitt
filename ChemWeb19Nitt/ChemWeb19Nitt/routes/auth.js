var express = require('express');
var router = express.Router();
var session = require('express-session');
var dataStore = '';
var bodyParser = require('body-parser');


var mysql = require('mysql');
var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'capital1197',
  database  : 'chemstudents'
});

var user = [];

connection.connect();
connection.query('SELECT * FROM USERS;', function(err, rows, fields) {
  if(err) throw err;
  dataStore = rows[0].Password;
  console.log('Connected!');
});

connection.end();

/* GET login page. */
router.post('/', function(req, res, next) {
  if(req.body.pwd == dataStore)
    res.render('auth', { notice: "Authentication Successful!" } );
  else {
    console.log("Authentication Error!");
    res.render('index', { notice: "Authentication Failed" } );
  }
});

module.exports = router;
