function btnClick(){
	return validate();
}

function validate(){
	var n = document.getElementById("name").value;
	var e = document.getElementById("email").value;
  var r = document.getElementById("roll").value;
	var p = document.getElementById("mobile").value;
	var pass = document.getElementById("pass").value;
	var c = document.getElementById("confp").value;
  var nat = document.getElementById("place").value;
  var dob = document.getElementById("dob").value;

  alert("In Validate()");
  alert(n+"\n"+e+"\n"+r+"\n"+p+"\n"+pass+"\n"+c+"\n"+nat+"\n"+dob);

  // Check dob,place.
  // TODO Perform form validation constraint in HTML itself.
	//Test name
	if (!(/[a-zA-Z]/.test(n))) {
		alert('No Letter Found in name');
		return false;
	}
	if(/\d/.test(n)){
		alert('Name shouldn\'t contain any number');
		return false;
	}
	if (!(/\S/.test(n))) {
		alert('The name must not be only whiteSpace');
		return false;
	}

	//Check phone
	if(!(/\d/.test(p))){
		alert("Phone must contain only digits");
		return false;
	}
	if(p.length !== 10){
		alert("Mobile number must contain 10 digits");
		return false;
	}

  // Check Roll number
  if(!(Math.floor(r/Math.pow(10,6)) ===102)){
		alert('Incorrect Roll Number');
		return false;
	}

	//Check mail
	if(e === ""){
		alert("Email must not be empty");
		return false;
	}
	if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.+[a-zA-Z]{2,4}$/.test(e))){
		alert("Invalid mail address");
		return false;
	}
  if(e.length!=18){
		alert('Enter valid email. Should be \'your roll number\'@nitt.edu');
		return false;
	}
	else{
		var ro = e.substring(0,9);
		var en = e.substring(9,18);
		//alert('ro is '+ro+'\nen is '+en);
		if(!(ro === r)){
			alert("Valid Email is'your roll number'@nitt.edu");
			return false;
		}
		if(!(en === "@nitt.edu")){
			alert("Valid Email is 'your roll number'@nitt.edu");
			return false;
		}
	}

	//Check pass
	if(!(/\S/.test(pass))){
		alert("The password must contain atleast 1 non-whitespace character, and must not be empty");
		return false;
	}
	if(!(/\S/.test(c))){
		alert("The Confirm password must contain atleast 1 non-whitespace character, and must not be empty");
		return false;
	}
	if(pass !== c){
		alert("Please re-enter the exact same password in the Confirm Password field");
		return false;
	}

  /*
	//Check the pic
	if( document.getElementById("imageUpload").files.length == 0 ){
		alert("no files selected");
		return false;
	}
  */
	return true;
}

/*
AJAX For form submission
document.getElementById('regis').addEventListener("submit",function(e){

	e.preventDefault();
	var f = e.target;
	//alert(f);
	var data = new FormData(f);
	//alert(data);
	//alert("Method is "+f.method);
	//alert("Action is "+f.action);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			//alert(xhttp.responseText);
			if(xhttp.responseText === "Success"){
				document.getElementById('regis').reset();

				alert('Successfully registered. Taking you to the login page now');
				window.location.href = '/../Delta_2016_3/';
            }
            else{
				if(xhttp.responseText === "Already logged in"){
					alert('Please Logout before registering a new user');
					location.reload();
				}
                else alert(xhttp.responseText);
            }
		}
	};
	xhttp.open(f.method,f.action,true);
	xhttp.send(data);
});
*/
