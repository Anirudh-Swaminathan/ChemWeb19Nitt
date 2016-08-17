var express = require('express');
var router = express.Router();
var mysql = require('mysql');
/*
var conn = mysql.createConnection({
  host  :  'localhost',
  user  :  'master',
  password  : 'Admin@123',
  database  : 'chemstudents'
});
conn.connect();
*/
var allStuds;

router.get('/',function(req,res,next){
  var conn = req.app.locals.connection;

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
  });
});

router.get('/auth', function (req, res, next) {
  //res.send('Please fill the form first');
  res.redirect('/register');
})

router.post('/auth/', function(req, res, next){
  var roll = req.body.roll;
  //var name = req.body.name;
  //var web = req.body.email;
  //var mob = req.body.mobile;
  //var dob = req.body.dob;
  //var nat = req.body.place;
  var pass = req.body.pass;
  //var conf = req.body.confp;

  var response = {};

  req.sanitize('roll').escape();
  req.sanitize('name').escape();
  req.sanitize('email').escape();
  req.sanitize('mobile').escape();
  req.sanitize('dob').escape();
  req.sanitize('place').escape();
  req.sanitize('pass').escape();
  req.sanitize('conf').escape();

  // Roll Number Validation
  req.assert('roll','Roll Number must not be empty').notEmpty();
  req.assert('roll','Roll Number must be integer').isInt();
  req.assert('roll','Roll Number must be 102115***').matches(/^102115\d{3}$/);

  // Name Validation
  req.assert('name','Name must not be empty.').notEmpty().matches(/[a-zA-Z][a-zA-Z ]+|[a-zA-Z]/);

  // Webmail Check
  req.assert('email','Webmail must not be empty.').notEmpty();
  req.assert('email',' Must be valid email').isEmail();
  req.assert('email',' Incorrect Mail').len(18,18);
  req.assert('email',' Webmail must be roll@nitt.edu').isWebmail(roll);

  // Check mobile
  req.assert('mobile','Mobile must not be empty').notEmpty();
  req.assert('mobile','Incorrect mobile number').matches(/^[0-9]{10}$/);

  // Check DOB
  req.assert('dob','Not a date').optional().isDate();

  // Check place
  req.assert('place','Invalid Place').optional().matches(/[a-zA-Z][a-zA-Z ]+|[a-zA-Z]/);

  // Check Passwords
  req.assert('pass','Password must not be empty, and mustn\'t contain any whitespace').notEmpty().noWhitespace();
  req.assert('confp','Confirm Password must not be empty, and mustn\'t contain any whitespace').notEmpty().noWhitespace();
  req.assert('confp','Please enter the same password as before').equals(pass);

  var errors = req.validationErrors();
  if(!errors){
    //res.send('Success');
    response.msg = 'Success';
    response.errors = {};
  } else {
    //res.send('Errors were '+errors);
    response.msg = 'Failure';
    response.errors = errors;
  }

  res.setHeader('Content-Type','application/json');
  res.send(JSON.stringify(response));

  //res.send(roll);
  //res.send('OK.'+roll+' '+name+' '+web+' '+mob+' '+dob+' '+nat+' '+pass+' '+conf+' ');
});
//conn.end();
module.exports = router;
