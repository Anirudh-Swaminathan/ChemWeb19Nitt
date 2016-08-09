var express = require('express');
var router = express.Router();
var dataStore = '';

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
  dataStore = rows[0].Name;
  console.log('Connected!');
});

connection.end();

/* GET login page. */
router.get('/', function(req, res, next) {
  /*var views = req.session.views;
  if(views) {
    views++;
  }
  else {
    views = 1;
  }
  req.session.destroy(function (err) {
    //
  });
  if(req.session) {
    views = 0;
  }
  if(!req.session) {
    views = 10;
  }*/
  res.render('login', { data: dataStore } );
});

module.exports = router;
