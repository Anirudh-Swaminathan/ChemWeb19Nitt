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
