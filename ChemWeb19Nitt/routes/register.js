var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

var allStuds;

var transporter = nodemailer.createTransport({
  service : 'Gmail',
  auth : {
    user : 'chemicalnitt19@gmail.com',
    pass : 'cnitt1519'
  }
});

// GET the register page.
router.get('/',function(req,res,next){
  // Cache control
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('pragma', 'no-cache');
  res.setHeader("Expires", "0");
  res.render('register');
});

// Stop get requests to auth page.
router.get('/auth', function (req, res, next) {
  // Cache control
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('pragma', 'no-cache');
  res.setHeader("Expires", "0");
  res.redirect('/register');
});

// TODO Check for already logged in(SESSION). AJAX callbacks for register page.
// TODO Provide captcha in the form.
router.post('/auth/', function(req, res, next){
  // Connection variable
  var conn = req.app.locals.connection;

  var response = {};

  req.sanitize('roll').escape();
  req.sanitize('name').escape();
  req.sanitize('email').escape();
  req.sanitize('mobile').escape();
  //req.sanitize('dob').escape();
  //req.sanitize('place').escape(); // Unnecessary field.
  req.sanitize('pass').escape();
  req.sanitize('conf').escape();

  var roll = req.body.roll;
  var name = req.body.name;
  var web = req.body.email;
  var mob = req.body.mobile;
  var dob = req.body.dob;
  //var nat = req.body.place; // Unnecessary field!!
  var pass = req.body.pass;
  var conf = req.body.confp;
  var acc = Math.floor(Math.random() * 900000) + 100000;
  var isCon = "false";

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

  // Check place - Unnecessary field.
  //req.assert('place','Invalid Place').optional().matches(/[a-zA-Z][a-zA-Z ]+|[a-zA-Z]/);

  // Check Passwords
  req.assert('pass','Password must not be empty, and mustn\'t contain any whitespace').notEmpty().noWhitespace();
  req.assert('confp','Confirm Password must not be empty, and mustn\'t contain any whitespace').notEmpty().noWhitespace();
  req.assert('confp','Please enter the same password as before').equals(pass);

  var errors = req.validationErrors();
  if(!errors){
    conn.query("SELECT isConf FROM chemstudents.students WHERE roll=?", roll, function(err, rows, fields){
      // Check if already registered.
      if(err){
        response.msg = 'Failure';
        response.errors = {};
        response.sqle = err;
        res.setHeader('Content-Type','application/json');
        res.send(JSON.stringify(response));
        return;
      }
      if(rows.length==0){
        // No => insert into table.
        bcrypt.genSalt(10, function(err, salt){
          if(err){
            // Salt generation error.
            console.log('Salt generation error');
            response.msg = 'Failure';
            response.errors = err;
            response.sqle = {};
            res.setHeader('Content-Type','application/json');
            res.send(JSON.stringify(response));
            return;
          }
          bcrypt.hash(pass, salt, function(err, hash){
            if(err){
              // Hashing error.
              console.log('Hashing error');
              response.msg = 'Failure';
              response.errors = err;
              response.sqle = {};
              res.setHeader('Content-Type','application/json');
              res.send(JSON.stringify(response));
              return;
            }
            // Insert into table
            conn.query("INSERT INTO chemstudents.students(roll,name,webmail,password,mobile,acc,isConf,dob) VALUES(?,?,?,?,?,?,?,?)",[roll,name,web,hash,mob,acc,isCon,dob], function(err, result){
              if(err){
                response.msg = 'Failure';
                response.errors = {};
                response.sqle = err;
                res.setHeader('Content-Type','application/json');
                res.send(JSON.stringify(response));
                return;
              }
              console.log('Last insert ID was '+result.insertId);
            });

            // Now send mail
            var message = "<p>Hello "+name+". This is the admin of Chemical Website."+
            "Your verification code is <b>"+acc+"</b>. If you didn\'t register, please"+
            " kindly ignore the above message.</p>";
            var mailOptions = {
              from : 'adminchem@nitt.edu',
              to : 'aniswami97@gmail.com',
              // to : web,
              // TODO Change the mail to address at production level.
              subject : 'Node Mailer Test',
              html : message
            };
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                console.log(error);
                response.msg = 'Failure';
                response.errors = error;
                response.sqle = {};
                res.setHeader('Content-Type','application/json');
                res.send(JSON.stringify(response));
                return;
              }
              // May insert data, but mail failure => can't verify.
              // TODO Change this logic for better UX.
              response.msg = 'Success';
              response.errors = {};
              response.sqle = {};
              res.setHeader('Content-Type','application/json');
              res.send(JSON.stringify(response));
              console.log('Message sent. Info is '+info.response);
            });

          });
        });
      } else {
        // If in table, check if account is confirmed.
        console.log('rows[0] is '+rows[0].isConf);
        if(rows[0].isConf === "false"){
          //console.log('Response was '+rows);
          console.log('Redirect to confirm mail');
          response.msg = 'Redirect';
          response.errors = {};
          response.sqle = {};
          res.setHeader('Content-Type','application/json');
          res.send(JSON.stringify(response));
        } else {
          // If confirmed, respond already registered.
          console.log('Already registered');
          response.msg = 'Registered';
          response.errors = {};
          response.sqle = {};
          res.setHeader('Content-Type','application/json');
          res.send(JSON.stringify(response));
        }
      }
    });
  } else {
    response.msg = 'Failure';
    response.errors = errors;
    response.sqle = {};
    res.setHeader('Content-Type','application/json');
    res.send(JSON.stringify(response));
  }
});

// GET verify page.
router.get('/verify', function(req, res, next){
  // Cache-Control
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('pragma', 'no-cache');
  res.setHeader("Expires", "0");
  res.render('verify');
});

// Stop get requests to auth page.
router.get('/verify/auth', function (req, res, next) {
  // Cache-Control
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('pragma', 'no-cache');
  res.setHeader("Expires", "0");
  res.redirect('/register/verify');
});

// POST to authentication page.
router.post('/verify/auth/', function(req, res, next){
  // Connection variable
  var conn = req.app.locals.connection;

  var response = {};

  req.sanitize('roll').escape();
  req.sanitize('cod').escape();

  var roll = req.body.roll;
  var cod = req.body.cod;

  // Roll Number Validation
  req.assert('roll','Roll Number must not be empty').notEmpty();
  req.assert('roll','Roll Number must be integer').isInt();
  req.assert('roll','Roll Number must be 102115***').matches(/^102115\d{3}$/);

  // Code validation
  req.assert('cod','Verification code must not be empty').notEmpty();
  req.assert('cod','It must be 6 digits long').matches(/^\d{6}$/);

  var errors = req.validationErrors();

  if(!errors){
    // Check if user is in table.
    // No => Redirect to registration page.
    // Yes => Check if user has confirmed.
    // No => Update table.  Yes => Registered.
    conn.query("SELECT isConf, acc FROM chemstudents.students WHERE roll=?", roll, function(err, rows, fields){
      if(err){
        response.msg = 'Failure';
        response.errors = {};
        response.sqle = err;
        res.setHeader('Content-Type','application/json');
        res.send(JSON.stringify(response));
        return;
      }
      if(rows.length==0){
        // User hasn't registered yet.
        response.msg = 'Redirect';
        response.errors = {};
        response.sqle = {};
        res.setHeader('Content-Type','application/json');
        res.send(JSON.stringify(response));
      } else {
        if(rows[0].isConf === "false"){
          // If not confirmed, confirm account now.
          if(cod === rows[0].acc){
            // Correct Access.
            conn.query("UPDATE chemstudents.students SET isConf = 'true' WHERE roll=?", roll, function(err, result){
              if(err){
                response.msg = 'Failure';
                response.errors = {};
                response.sqle = err;
                res.setHeader('Content-Type','application/json');
                res.send(JSON.stringify(response));
                return;
              }
              console.log('Changed '+result.changedRows+' rows.');
              response.msg = 'Success';
              response.errors = {};
              response.sqle = {};
              res.setHeader('Content-Type','application/json');
              res.send(JSON.stringify(response));
            });
          } else {
            // Incorrect acc.
            console.log('Incorrect access');
            response.msg = 'Incorrect';
            response.errors = {};
            response.sqle = {};
            res.setHeader('Content-Type','application/json');
            res.send(JSON.stringify(response));
          }
        } else if(rows[0].isConf === "true"){
          // If confirmed, respond already registered.
          console.log('Already registered');
          response.msg = 'Registered';
          response.errors = {};
          response.sqle = {};
          res.setHeader('Content-Type','application/json');
          res.send(JSON.stringify(response));
        }
      }
    });
  } else {
    response.msg = 'Failure';
    response.errors = errors;
    response.sqle = {};
    res.setHeader('Content-Type','application/json');
    res.send(JSON.stringify(response));
  }
});

module.exports = router;
