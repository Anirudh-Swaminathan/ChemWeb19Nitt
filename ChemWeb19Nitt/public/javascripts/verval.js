alert('Hello');
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

// AJAX
document.getElementById('veriform').addEventListener("submit", function(e){
  alert('Clicked');
  e.preventDefault();
  var f = e.target;
  var data = new FormData(f);
  alert('data,method,action is '+data+' '+f.method+' '+f.action);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if(xhttp.readyState == 4 && xhttp.status == 200){
      // TODO Check JSON response.
      var json = xhttp.responseText;
			var jsonObj = JSON.parse(json);
      var msg = jsonObj.msg;

      alert('Message is '+msg);
      alert('Errors are '+jsonObj.errors[0].msg);
    }
  }
  xhttp.open(f.method,f.action,true);
	xhttp.send(data);
});
