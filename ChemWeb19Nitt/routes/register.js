var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host  :  'localhost',
  user  :  'master',
  password  : 'Admin@123',
  database  : 'chemstudents'
});

var allStuds;

router.get('/',function(req,res,next){
  //var conn = req.app.locals.connection;
  conn.connect();
  conn.query("SELECT * FROM students as SOLUTION",function(err, rows, fields){
    if(err){
      console.log(err);
      throw err;
      return;
    }
    for(var i=0; i<rows.length; ++i){
      console.log(rows[i]);
    }
    allStuds = rows;
    res.render('register',{studs: allStuds});
    conn.end();
  });
});
module.exports = router;
