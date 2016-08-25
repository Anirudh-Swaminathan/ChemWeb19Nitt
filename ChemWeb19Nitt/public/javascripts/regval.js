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
  var nat = document.getElementById('place').value;
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
    //alert('e is '+e+'\n r is '+r);
    //alert('e start is '+e.substr(0,9)+'\n e end is '+e.substr(9,18));
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
      //alert('It\'s February!');
      if(isLeap(yea)){
        if(day>29){
          alert('Incorrect date. Must be <=29');
          return false;
        }
      } else {
        //alert('Not a leap year');
        if(day>28){
          alert('Incorrect date. Must be <=28');
          return false;
        }
      }
    }
  }

  // Check place
  if(nat!=""){
    if(!(nat.match('[a-zA-Z][a-zA-Z ]+|[a-zA-Z]'))){
      alert('The place mustn\'t contain special characters');
      return false;
    }
  }

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
document.getElementById('regBtn').addEventListener("submit", function(e){
  e.preventDefault();
  var f = e.target;
  var data = new FormData(f);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(xhttp.readyState == 4 && xhttp.status == 200){
      // TODO Check JSON response.
      var json = xhttp.responseText;
			var jsonObj = JSON.parse(json);
      var msg = jsonObj.msg;

      // If Success. Redirect to verification page.
      if(msg === 'Success'){
        alert('Please verify your account now');
        window.location.href = '/verify';
      } else {
        alert('Message is '+msg);
      }
    }
  };
  xhttp.open(f.method,f.action,true);
	xhttp.send(data);
});
