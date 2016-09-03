function btnClick(){
  return validate();
}

// A function to validate input
function validate(){
    var r = document.getElementById('roll').value;
    var c = document.getElementById('cod').value;

    // Check roll number
    // Only Chemical Students of 2nd year.
    if(Math.floor(r/Math.pow(10,3))!=102115){
      alert('Incorrect Roll Number for a Chemical 2nd year student');
      return false;
    }

    // Check code
    if(!c.match(/^\d{6}$/)){
      alert('Verification code must be 6 digits long');
      return false;
    }
    return true;
}

// ajax
// 5 possible outcomes

// 1. Success => redirect to login page
// 2. Redirect => redirect to register page.
// 3.Failure => Stay on the page.
// 4. Incorrect => Stay on the page.
// 5. Registered => redirect to login page.
document.getElementById('veriform').addEventListener("submit", function(e){
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
          $('#veriform')[0].reset();
          alert('Verified account successfully');
          window.location.href = '../login';
          break;
        case 'Redirect':
          $('#veriform')[0].reset();
          alert('Please register first');
          window.location.href = '../register';
          break;
        case 'Failure':
          var mess = '';
          if(errors.length !== 0){
            mess += errors[0].msg;
          } else {
            mess += sqle[0].msg;
          }
          alert('Failure to verify. Error was '+mess);
          break;
        case 'Incorrect':
          $('#veriform')[0].reset();
          alert('Roll Number or verification code is incorrect');
          break;
        case 'Registered':
          $('#veriform')[0].reset();
          alert('Already registered');
          window.location.href = '../login';
          break;
        default:
          alert('Not my API!!!');
          break;
      }
    }
  }
  var values = {};
  $.each($('#veriform').serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });
  xhttp.open(f.method, f.action, true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(values));
});
