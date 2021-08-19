$("input:checkbox").on('click', function() {
  // in the handler, 'this' refers to the box clicked on
  var $box = $(this);
  if ($box.is(":checked")) {
    // the name of the box is retrieved using the .attr() method
    // as it is assumed and expected to be immutable
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    // the checked state of the group/box on the other hand will change
    // and the current value is retrieved using .prop() method
    $(group).prop("checked", false);
    $box.prop("checked", true);
  } else {
    $box.prop("checked", false);
  }
});

function removeDogField(){
  document.getElementById('dogRegistration').style.display = "none";
}

function addDogField(){
  document.getElementById('dogRegistration').style.display = "block";
}

function validateForm(){
  var userType = document.forms["registerForm"]["userType"].value;
  var userName = document.forms["registerForm"]["username"].value;
  var name = document.forms["registerForm"]["name"].value;
  var email = document.forms["registerForm"]["email"].value;
  var address = document.forms["registerForm"]["address"].value;
  var suburb = document.forms["registerForm"]["suburb"].value;
  var dogsName = document.forms["registerForm"]["dogsName"].value;
  var dogsBreed = document.forms["registerForm"]["dogsBreed"].value;
  var dogsSize = document.forms["registerForm"]["dogsSize"].value;
  var dogsWeight = document.forms["registerForm"]["dogsWeight"].value;
  var dogsAge = document.forms["registerForm"]["dogsAge"].value;
  var password = document.forms["registerForm"]["password"].value;

  if(userType == ""){
    alert("User type must be chosen before submitting form");
    return false;
  }

   if(userType === "Dog Owner"){
     if(userName == ""){
       alert("Username must be filled before submitting form");
       return false;
     }else if(name == ""){
       alert("Name must be filled before submitting form");
       return false;
     }else if(email == ""){
       alert("Email must be filled before submitting form");
       return false;
     }else if(address == ""){
       alert("Address must be filled before submitting form");
       return false;
     }else if(suburb == ""){
       alert("Suburb must be filled before submitting form");
       return false;
     }else if(dogsName == ""){
       alert("Dog's name must be filled before submitting form");
       return false;
     }else if(dogsBreed == ""){
       alert("Dog's breed must be filled before submitting form");
       return false;
     }else if(dogsSize == ""){
       alert("Dog's size must be filled before submitting form");
       return false;
     }else if(dogsWeight == ""){
       alert("Dog's weight must be filled before submitting form");
       return false;
     }else if(dogsAge == ""){
       alert("Dog's age must be filled before submitting form");
       return false;
     }else if(password == ""){
       alert("Password must be filled before submitting form");
       return false;
     }
   }else if(userType === "Trainer"){
     if(userName == ""){
       alert("Username must be filled before submitting form");
       return false;
     }else if(name == ""){
       alert("Name must be filled before submitting form");
       return false;
     }else if(email == ""){
       alert("Email must be filled before submitting form");
       return false;
     }else if(address == ""){
       alert("Address must be filled before submitting form");
       return false;
     }else if(suburb == ""){
       alert("Suburb must be filled before submitting form");
       return false;
     }else if(password == ""){
       alert("Password must be filled before submitting form");
       return false;
     }
   }else{
     return true;
   }
}
