function btnClick(){
  return validate();
}

// A function to validate input
function validate(){
  var r = document.getElementById('roll').value;
  var n = document.getElementById('name').value;
  var e = document.getElementById('email').value;
  var m = document.getElementById('mobile').value;
  var dob = document.getElementById('dob').value;
  //var nat = document.getElementById('place').value;
  var pa = document.getElementById('pass').value;
  var con = document.getElementById('confp').value;

  // Check roll number
  // Only Chemical Students of 2nd year.
  if(Math.floor(r/Math.pow(10,3))!=102115){
    alert('Incorrect Roll Number for a Chemical 2nd year student');
    return false;
  }

  // Check name
  if(!(n.match('[a-zA-Z][a-zA-Z ]+|[a-zA-Z]'))){
    alert('The Name must not be empty and mustn\'t contain special characters');
    return false;
  }

  // Check WebMail
  if(e.length!=18){
    alert('Webmail must be <roll>@nitt.edu');
    return false;
  } else {
    if(e.substr(0,9)!=r || e.substr(9,18)!='@nitt.edu'){
      alert('Webmail must be <roll>@nitt.edu');
      return false;
    }
  }

  // Check Mobile
  if(!(m.match('^[0-9]{10}$'))){
    alert('Incorrect Mobile Number');
    return false;
  }

  // Check DOB
  if(dob!=""){
    if(dob === "" || dob.length!=10){
      alert('Incorrect dob. Must be yyyy/mm/dd');
      return false;
    }
    var yea = parseInt(dob.substr(0,4));
    var mon = parseInt(dob.substr(5,2));
    var day = parseInt(dob.substr(8,2));
    if(isNaN(day) || isNaN(mon) || isNaN(yea)){
      alert('Incorrect date. Must be yyyy/mm/dd');
      return false;
    }
    if(mon<0 || mon>13){
      alert('Incorrect month. Must be yyyy/mm/dd');
      return false;
    }
    if(day<0 || yea<0){
      alert('Incorrect day or year. Must be yyyy/mm/dd');
      return false;
    }
    if((mon==1||mon==3||mon==5||mon==7||mon==8||mon==10||mon==12) && day>31){
      alert('Incorrect date. Must be <=31');
      return false;
    }
    if((mon==4||mon==6||mon==9||mon==11) && day>30){
      alert('Incorrect date. Must be <=30');
      return false;
    }
    if(mon==2){
      if(isLeap(yea)){
        if(day>29){
          alert('Incorrect date. Must be <=29');
          return false;
        }
      } else {
        if(day>28){
          alert('Incorrect date. Must be <=28');
          return false;
        }
      }
    }
  }

  /*
  Unnecessary field!!
  // Check place
  if(nat!=""){
    if(!(nat.match('[a-zA-Z][a-zA-Z ]+|[a-zA-Z]'))){
      alert('The place mustn\'t contain special characters');
      return false;
    }
  }
  */
  // Check pass and confp
  if(pa == "" || con == ""){
    alert('Password and confirm pasword must not be null');
    return false;
  }
  var st = pa;
  if (/\s/g.test(st)) {
    // string only contained whitespace (ie. spaces, tabs or line breaks)
    alert('Password mustn\'t contain any whitespace');
    return false;
  }
  if(pa!=con){
    alert('Please enter the same value of password in the confirm password field');
    return false;
  }

  return true;
}

// To check if the year is a leap year
function isLeap(ye){
  var ret = false;
  //alert('In isLeap\nye is '+ye);
  if(ye%4==0){
    if(ye%100 == 0){
      if(ye%400 == 0){
        ret = true;
      } else {
        ret = false;
      }
    } else {
      ret = true;
    }
  } else {
    ret = false;
  }
  return ret;
}

// AJAX
// 4 possible outcomes

// 1. Success => redirect to verify page
// 2. Redirect => redirect to verify page
// 3.Failure => Stay on the page.
// 4. Registered => redirect to login page.
document.getElementById('regform').addEventListener("submit", function (e) {
  e.preventDefault();
  var f = e.target;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var json = xhttp.responseText;
      var jsonObj = JSON.parse(json);
      var msg = jsonObj.msg;
      var errors = jsonObj.errors;
      var sqle = jsonObj.sqle;
      switch (msg) {
        case 'Success':
          $('#regform')[0].reset();
          alert('Registration successful. Please check webmail to verify your account');
          window.location.href = '/register/verify';
          break;
        case 'Redirect':
          $('#regform')[0].reset();
          alert('Already registered. Please check webmail to verify your account');
          window.location.href = '/register/verify';
          break;
        case 'Failure':
          var mess = '';
          if(errors.length !== 0){
            mess += errors[0].msg;
          } else {
            mess += sqle[0].msg;
          }
          alert('Failed to register. Error was '+mess);
          break;
        case 'Registered':
          $('#regform')[0].reset();
          alert('Already registered.');
          window.location.href = '../login';
          break;
        default:
          alert('Not my API!!!');
          break;
      }
    }
  }
  var values = {};
  $.each($('#regform').serializeArray(), function(i, field) {
    if(field.name === 'dob'){ // Removed Unnecessary field.
      if(field.value !== ''){
        values[field.name] = field.value;
      }
    } else {
      values[field.name] = field.value;
    }
  });
  xhttp.open(f.method, f.action, true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(values));
});
