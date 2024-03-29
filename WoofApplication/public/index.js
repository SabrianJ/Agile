var numberOfDogs = 1;
let directionsService;
let directionsDisplay;
var newDog = 0;
var updatedDog = false;
var checkList = document.getElementById('preferenceInput');
var checkListOwner = document.getElementById('dogOwnersInput');
var checkListGroup = document.getElementById('groupsInput');
var checkListGroup1 = document.getElementById('groupsInput1');
var checkListCurrentOwner = document.getElementById('currentOwnersInput');
var checkListCurrentTrainer = document.getElementById('currentTrainersInput');
var checkListTrainer = document.getElementById('trainersInput');
var mapDIV = document.getElementById('map');
var max = setMaxDate();
var marker2;
var coordinate;
var map;


function initialize() {
  var input = document.getElementById('addressInput');

  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.setComponentRestrictions({
   country: ["nz"],
 });

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();

      let cityIncluded = place.formatted_address;

      let city = place.address_components[3].long_name;

      if(city.includes("Auckland") || city.includes("Christchurch") || city.includes("Wellington")||cityIncluded.includes("Auckland") || cityIncluded.includes("Christchurch") || cityIncluded.includes("Wellington")){
        document.getElementById('cityInput').value = place.address_components[3].long_name;
        document.getElementById("suburbInput").options[0]=new Option(place.address_components[2].long_name,place.address_components[2].long_name);
        document.getElementById('suburbInput').value = place.address_components[2].long_name;
      }else{
        alert("Only Auckland, Wellington and Christchurch that is supported by this app");
      }

  });
}

function calculateDistance(){
  if(directionsDisplay != null) {
    directionsDisplay.setMap(null);
    directionsDisplay = null;
}

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer(
    {
      suppressMarkers: true,
      suppressInfoWindows: true
    });

directionsDisplay.setMap(map);
var lat1 = coordinate.lat();
var lng1 = coordinate.lng();
var lat2 = marker2.position.lat();
var lng2 = marker2.position.lng();
var request = {
  origin: {lat: lat1, lng: lng1},
  destination: {lat: lat2, lng: lng2},
  travelMode: google.maps.DirectionsTravelMode.DRIVING
};
directionsService.route(request, function(response, status)
{
if (status == google.maps.DirectionsStatus.OK)
{
directionsDisplay.setDirections(response);
let distance;
distance = "The distance between the two points on the fastest route is: "+response.routes[0].legs[0].distance.text;
distance += ". The aproximative driving time is: "+response.routes[0].legs[0].duration.text;
document.getElementById("distanceInfo").innerHTML = distance;

}
});
}

google.maps.event.addDomListener(window, 'load', initialize)

function initMap() {
      const componentForm = [
        'location',
        'locality',
        'administrative_area_level_1',
        'country',
        'postal_code',
      ];

      var geocoder = new google.maps.Geocoder();


      var address = document.getElementById('address').value;

       map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: coordinate,
        mapId : '8eeafa140cb3198f',
      });

      geocoder.geocode({
       'address': address
   }, function(results, status) {
        coordinate = results[0].geometry.location;
       if (status == 'OK') {
         map.setCenter(results[0].geometry.location);

         var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            draggable: false
        });

        marker2 = new google.maps.Marker({
          map :map,
          draggable: true,
          position : results[0].geometry.location,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }
        });

        const calculateDiv = document.createElement("div");
        CalculateControl(calculateDiv);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(calculateDiv);

       }else{
         alert('Geocode was not successful for the following reason: ' + status);
       }
   });
}

function CalculateControl(calculateDIV) {
  // Set CSS for the control border.
  const controlUI = document.createElement("div");

  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginTop = "8px";
  controlUI.style.marginBottom = "22px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to calculate distance";
  calculateDIV.appendChild(controlUI);

  // Set CSS for the control interior.
  const controlText = document.createElement("div");

  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "Calculate";
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener("click", () => {
    calculateDistance();
  });
}



function joinInvitation(event, invitationID,type){
  window.open("/join/" + type + "/" + invitationID,"_self");
}

function addNewDog(currentDogs){

if(!updatedDog){
  newDog = currentDogs;
  updatedDog = true;
}

const dogRegistration = document.createElement('div');
dogRegistration.classList.add('form-group');
dogRegistration.id = 'dogRegistration' + ++window.newDog;
dogRegistration.innerHTML =
  '<label for="dogName">Dog '+ window.newDog + '</label>' +
  '<input type="text" class="form-control" id="newDogsName" maxlength="30" placeholder="Name" name="newDogsName' + window.newDog +'" style="width:80%">' +
  '<label for="newDogsBreed">Breed</label>' +
  '<select id="newDogsBreed" name="newDogsBreed'+ window.newDog +'" class="form-control" placeholder="Breed" style="width:25%">' +
  '<option value="Affenpinscher" selected>Affenspinscher</option>' +
  '<option value="Afghan Hound">Afghan Hound</option>' +
  '<option value="Africanis">Africanis</option>' +
    '<option value="Akita">Akita</option>' +
    '<option value="American Bulldog">American Bulldog</option>' +
    '<option value="Basque Shepherd Dog">Basque Shepherd Dog</option>' +
    '<option value="Basset Hound">Basset Hound</option>'+
    '<option value="Bichon Frise">Bichon Frise</option>'+
    '<option value="Bohemian Shepherd">Bohemian Shepherd</option>'+
    '<option value="Bulldog">Bulldog</option>'+
    '<option value="Carolina Dog">Carolina Dog</option>'+
    '<option value="Chihuahua">Chihuahua</option>'+
    '<option value="Dalmatian">Dalmatian</option>'+
    '<option value="Dingo">Dingo</option>'+
    '<option value="Dobermann">Dobermann</option>'+
    '<option value="Drever">Drever</option>'+
    '<option value="Dunker">Dunker</option>'+
    '<option value="English Mastiff">English Mastiff</option>'+
    '<option value="English Shepherd">English Shepherd</option>'+
    '<option value="Estonian Hound">Estonian Hound</option>'+
    '<option value="Finnish Hound">Finnish Hound</option>'+
    '<option value="French Bulldog">French Bulldog</option>'+
    '<option value="German Hound">German Hound</option>'+
    '<option value="German Shepherd">German Shepherd</option>'+
    '<option value="Himalayan Sheepdog">Himalayan Sheepdog</option>'+
    '<option value="Hierran Wolfdog">Hierran Wolfdog</option>'+
    '<option value="Indian Spitz">Indian Spitz</option>'+
    '<option value="Italian Greyhound">Italian Greyhound</option>'+
    '<option value="Japanese Spitz">Japanese Spitz</option>'+
    '<option value="Kai Ken">Kai Ken</option>'+
    '<option value="Kaikadi">Kaikadi</option>'+
    '<option value="Labrador Retriever">Labrador Retriever</option>'+
    '<option value="Lithuanian Hound">Lithuanian Hound</option>'+
    '<option value="Maltese">Maltese</option>'+
    '<option value="Mountain Cur">Mountain Cur</option>'+
    '<option value="New Zealand Heading">New Zealand Heading</option>'+
    '<option value="Otterhound">Otterhound</option>'+
    '<option value="Papillon">Papillon</option>'+
    '<option value="Patagonian Sheepdog">Patagonian Sheepdog</option>'+
    '<option value="Pekingese">Pekingese</option>'+
    '<option value="Pointer">Pointer</option>'+
    '<option value="Poitevin">Poitevin</option>'+
    '<option value="Poodle">Poodle</option>'+
    '<option value="Pudelpointer">Pudelpointer</option>'+
    '<option value="Pug">Pug</option>'+
    '<option value="Pungsan">Pungsan</option>'+
    '<option value="Rottweiler">Rottweiler</option>'+
    '<option value="Russian Spaniel">Russian Spaniel</option>'+
    '<option value="Ryukyu Inu">Ryukyu Inu</option>'+
    '<option value="Shiba Inu">Shiba Inu</option>'+
    '<option value="Shih Tzu">Shih Tzu</option>'+
    '<option value="Siberian Husky">Siberian Husky</option>'+
    '<option value="Taigan">Taigan</option>'+
    '<option value="Tamaskan Dog">Tamaskan Dog</option>'+
    '<option value="Weimaraner">Weimaraner</option>'+
    '<option value="Welsh Sheepdog">Welsh Sheepdog</option>'+
    '<option value="Whippet">Whippet</option>'+
    '<option value="Yakultian Laika">Yakultian Laika</option>'+
    '<option value="Other">Other</option>'+
  '</select>'+

  '<div class="radioButton" style="margin-top:10px; margin-bottom:10px;">'+
    '<label>Size : </label>'+
    '<label><input style="margin-left:10px;" type="radio" name="newDogsSize'+ window.newDog +'" value="small">Small</label>'+
    '<label><input style="margin-left:10px;" type="radio" name="newDogsSize'+ window.newDog +'" value="medium">Medium</label>'+
    '<label><input style="margin-left:10px;" type="radio" name="newDogsSize'+ window.newDog +'" value="big">Big</label>'+
  '</div>'+
  '<input type="number" class="form-control" id="newDogsWeight" placeholder="Weight (in kg)" name="newDogsWeight'+ window.newDog +'" style="width:25%">'+
  '<label for="newDogsDateOfBirth" class="form-label">Please choose the date of birth of your dog</label>'+
  '<input type="date" class="form-control" id="newDogsDateOfBirth" name="newDogsDateOfBirth' + window.newDog +'" style="width:25%" max="'+ window.max +'" >'+
  '<div class="form-group">' +
  '<input type="text" style="display:none;" class="form-control" id="imageURI'+ window.newDog+'"  name="imageURI' + window.newDog + '" value="">' +
  '<label for="newDogsImage" class="form-label">Please upload your dog image</label>' +
  '<br><input type="file" class="form-input" id="newDogsImage" name="newDogsImage'+ window.numberOfDogs +'" onchange="loadFile(event,' + window.newDog +')" value="" />'+
  '<br><img id="output'+ window.newDog +'" class="dogImage"  />'+
  '</div>';

  const dogInner = document.getElementById("dogInner");
  dogInner.appendChild(dogRegistration);

}

function deleteInvitation(event, invitationID){
  window.open("/delete/invitation/" + invitationID,"_self");
}

function dropdownChecklistOwner() {
  if (checkListOwner.classList.contains('visible'))
    checkListOwner.classList.remove('visible');
  else
    checkListOwner.classList.add('visible');
}

function dropdownChecklistTrainer() {
  if (checkListTrainer.classList.contains('visible'))
    checkListTrainer.classList.remove('visible');
  else
    checkListTrainer.classList.add('visible');
}

function dropdownChecklistGroup() {
  if (checkListGroup.classList.contains('visible'))
    checkListGroup.classList.remove('visible');
  else
    checkListGroup.classList.add('visible');
}

function dropdownChecklistGroup1() {
  if (checkListGroup1.classList.contains('visible'))
    checkListGroup1.classList.remove('visible');
  else
    checkListGroup1.classList.add('visible');
}

function dropdownChecklistCurrentOwner(){
  if(checkListCurrentOwner.classList.contains('visible'))
    checkListCurrentOwner.classList.remove('visible');
  else
    checkListCurrentOwner.classList.add('visible');
}

function dropdownChecklistCurrentTrainer(){
  if(checkListCurrentTrainer.classList.contains('visible'))
    checkListCurrentTrainer.classList.remove('visible');
  else
    checkListCurrentTrainer.classList.add('visible');
}

function inviteGroup(){
  var checkbox = document.getElementById('inviteGroup');
  var groupsDropDown = document.getElementById('groups');

  if(checkbox.checked == true){
        groupsDropDown.style.display = "none";
    }else{
        groupsDropDown.style.display = "block";
   }
}

function excludeGroup(){
  var checkbox = document.getElementById('excludeGroup');
  var groupsDropDown = document.getElementById('groups1');

  if(checkbox.checked == true){
        groupsDropDown.style.display = "none";
    }else{
        groupsDropDown.style.display = "block";
   }
}

function inviteTrainer(){
  var checkbox = document.getElementById('inviteSomeone');
  var dogOwnersDropDown = document.getElementById('trainers');

  if(checkbox.checked == true){
        dogOwnersDropDown.style.display = "none";
    }else{
        dogOwnersDropDown.style.display = "block";
   }
}


function inviteSomeone(){
  var checkbox = document.getElementById('inviteSomeone');
  var dogOwnersDropDown = document.getElementById('dogOwners');

  if(checkbox.checked == true){
        dogOwnersDropDown.style.display = "none";
    }else{
        dogOwnersDropDown.style.display = "block";
   }
}

function excludeSomeone(){
  var checkbox = document.getElementById('excludeSomeone');
  var currentOwnersDropDown = document.getElementById('currentOwners');

  if(checkbox.checked == true){
    currentOwnersDropDown.style.display = "none";
  }else{
    currentOwnersDropDown.style.display = "block";
  }
}

function excludeTrainer(){
  var checkbox = document.getElementById('excludeSomeone');
  var currentOwnersDropDown = document.getElementById('currentTrainers');

  if(checkbox.checked == true){
    currentOwnersDropDown.style.display = "none";
  }else{
    currentOwnersDropDown.style.display = "block";
  }
}

function rangeValue(){
  var range = document.getElementById('rangeInput');
  var distance = document.getElementById('distance');
  var distanceRange = document.getElementById('distanceRange');
  if(range.value == 1){
    distance.value = 500;
    distanceRange.innerHTML = "500 meters";
  }else if(range.value == 2){
    distance.value = 1000;
    distanceRange.innerHTML = "1000 meters";
  }else if(range.value == 3){
    distance.value = 1500;
    distanceRange.innerHTML = "1500 meters";
  }else if(range.value == 4){
    distance.value = 2000;
    distanceRange.innerHTML = "2000 meters";
  }else if(range.value == 5){
    distance.value = 2500;
    distanceRange.innerHTML = "> 2000 meters";
  }
}


function alternateImage(event){
  const target = event.target;
  target.src = "/img/undraw_profile.svg";
}

function setMaxDate() {
var d = new Date();
var month = '' + (d.getMonth() + 1);
var day = '' + d.getDate();
var year = d.getFullYear();

if (month.length < 2)
    month = '0' + month;
if (day.length < 2)
    day = '0' + day;

return [year, month, day].join('-');
}


function dropdownChecklist() {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}

function dropdownChecklistUpdateProfile(preferenceArray) {
  if (checkList.classList.contains('visible')){
    checkList.classList.remove('visible');
  }else{
    checkList.classList.add('visible');
  }

    for(var i=0 ; i < preferenceArray.length ; i++){
      var chk_arr =  document.getElementsByName("preferences[]");
      var chklength = chk_arr.length;

            for(var k=0;k< chklength;k++){
                if(chk_arr[k].value == preferenceArray[i]){
                chk_arr[k].checked = true;
                }
            }
    }
}

function validateCreateForm(createdForm){
  var location = document.forms[createdForm + "Form"]["addressInput"].value;
  var dateTime = document.forms[createdForm + "Form"][createdForm + "DateTime"].value;
  var name = document.forms[createdForm + "Form"][createdForm + "Name"].value;
  var description = document.forms[createdForm + "Form"][createdForm + "Description"].value;

  if(location == ""){
    alert("Location must be filled before submitting form");
    return false;
  }else if(!Date.parse(dateTime)){
    alert("Date and Time must be filled before submitting form");
    return false;
  }else if(name == ""){
    alert("Name must be filled before submitting form");
    return false;
  }else if(description == ""){
    alert("Description must be filled before submitting form");
    return false;
  }else{
    return true;
  }
}

function validateCreateGroup(){
  var name = document.forms["groupForm"]["nameInput"].value;
  var description = document.forms["groupForm"]["groupDescription"].value;
  var message = document.forms["groupForm"]["message"].value;

  if(name == ""){
    alert("Name must be filled before submitting form");
    return false;
  }else if(description == ""){
    alert("Description must be filled before submitting form");
    return false;
  }else if(message == ""){
    alert("Message must be filled before submitting form");
    return false;
  }else{
    return true;
  }
}



function addDog(){

const dogRegistration = document.createElement('div');
dogRegistration.classList.add('form-group');
dogRegistration.id = 'dogRegistration' + ++window.numberOfDogs;
dogRegistration.innerHTML =
'<hr size="10" style="height:3px;color:#000000;">'+
  '<label for="dogName">Dog '+ window.numberOfDogs + '</label>' +
  '<input type="text" class="form-control" id="dogsName" maxlength="30" placeholder="Name" name="dogsName' + window.numberOfDogs +'" style="width:80%">' +
  '<label for="dogsBreed">Breed</label>' +
  '<select id="dogBreed" name="dogsBreed'+ window.numberOfDogs +'" class="form-control" placeholder="Breed" style="width:25%">' +
  '<option value="Affenpinscher" selected>Affenspinscher</option>' +
  '<option value="Afghan Hound">Afghan Hound</option>' +
  '<option value="Africanis">Africanis</option>' +
    '<option value="Akita">Akita</option>' +
    '<option value="American Bulldog">American Bulldog</option>' +
    '<option value="Basque Shepherd Dog">Basque Shepherd Dog</option>' +
    '<option value="Basset Hound">Basset Hound</option>'+
    '<option value="Bichon Frise">Bichon Frise</option>'+
    '<option value="Bohemian Shepherd">Bohemian Shepherd</option>'+
    '<option value="Bulldog">Bulldog</option>'+
    '<option value="Carolina Dog">Carolina Dog</option>'+
    '<option value="Chihuahua">Chihuahua</option>'+
    '<option value="Dalmatian">Dalmatian</option>'+
    '<option value="Dingo">Dingo</option>'+
    '<option value="Dobermann">Dobermann</option>'+
    '<option value="Drever">Drever</option>'+
    '<option value="Dunker">Dunker</option>'+
    '<option value="English Mastiff">English Mastiff</option>'+
    '<option value="English Shepherd">English Shepherd</option>'+
    '<option value="Estonian Hound">Estonian Hound</option>'+
    '<option value="Finnish Hound">Finnish Hound</option>'+
    '<option value="French Bulldog">French Bulldog</option>'+
    '<option value="German Hound">German Hound</option>'+
    '<option value="German Shepherd">German Shepherd</option>'+
    '<option value="Himalayan Sheepdog">Himalayan Sheepdog</option>'+
    '<option value="Hierran Wolfdog">Hierran Wolfdog</option>'+
    '<option value="Indian Spitz">Indian Spitz</option>'+
    '<option value="Italian Greyhound">Italian Greyhound</option>'+
    '<option value="Japanese Spitz">Japanese Spitz</option>'+
    '<option value="Kai Ken">Kai Ken</option>'+
    '<option value="Kaikadi">Kaikadi</option>'+
    '<option value="Labrador Retriever">Labrador Retriever</option>'+
    '<option value="Lithuanian Hound">Lithuanian Hound</option>'+
    '<option value="Maltese">Maltese</option>'+
    '<option value="Mountain Cur">Mountain Cur</option>'+
    '<option value="New Zealand Heading">New Zealand Heading</option>'+
    '<option value="Otterhound">Otterhound</option>'+
    '<option value="Papillon">Papillon</option>'+
    '<option value="Patagonian Sheepdog">Patagonian Sheepdog</option>'+
    '<option value="Pekingese">Pekingese</option>'+
    '<option value="Pointer">Pointer</option>'+
    '<option value="Poitevin">Poitevin</option>'+
    '<option value="Poodle">Poodle</option>'+
    '<option value="Pudelpointer">Pudelpointer</option>'+
    '<option value="Pug">Pug</option>'+
    '<option value="Pungsan">Pungsan</option>'+
    '<option value="Rottweiler">Rottweiler</option>'+
    '<option value="Russian Spaniel">Russian Spaniel</option>'+
    '<option value="Ryukyu Inu">Ryukyu Inu</option>'+
    '<option value="Shiba Inu">Shiba Inu</option>'+
    '<option value="Shih Tzu">Shih Tzu</option>'+
    '<option value="Siberian Husky">Siberian Husky</option>'+
    '<option value="Taigan">Taigan</option>'+
    '<option value="Tamaskan Dog">Tamaskan Dog</option>'+
    '<option value="Weimaraner">Weimaraner</option>'+
    '<option value="Welsh Sheepdog">Welsh Sheepdog</option>'+
    '<option value="Whippet">Whippet</option>'+
    '<option value="Yakultian Laika">Yakultian Laika</option>'+
    '<option value="Other">Other</option>'+
  '</select>'+

  '<div class="radioButton" style="margin-top:10px; margin-bottom:10px;">'+
    '<label>Size : </label>'+
    '<label><input style="margin-left:10px;" type="radio" name="dogsSize'+ window.numberOfDogs +'" value="small">Small</label>'+
    '<label><input style="margin-left:10px;" type="radio" name="dogsSize'+ window.numberOfDogs +'" value="medium">Medium</label>'+
    '<label><input style="margin-left:10px;" type="radio" name="dogsSize'+ window.numberOfDogs +'" value="big">Big</label>'+
  '</div>'+
  '<input type="number" class="form-control" id="dogsWeight" placeholder="Weight (in kg)" name="dogsWeight'+ window.numberOfDogs +'" style="width:25%">'+
  '<label for="dogsDateOfBirth" class="form-label">Please choose the date of birth of your dog</label>'+
  '<input type="date" class="form-control" id="dogsDateOfBirth" name="dogsDateOfBirth' + window.numberOfDogs +'" style="width:25%" max="'+ window.max +'" >'+
  '<div class="form-group">' +
  '<input type="text" style="display:none;" class="form-control" id="imageURI'+ window.numberOfDogs+'"  name="imageURI' + window.numberOfDogs + '" value="">' +
  '<label for="dogsImage" class="form-label">Please upload your dog image</label>' +
  '<br><input type="file" class="form-input" id="dogsImage" name="dogsImage'+ window.numberOfDogs +'" onchange="loadFile(event,' + window.numberOfDogs +')" value="" />'+
  '<br><img id="output'+ window.numberOfDogs +'" class="dogImage"  />'+
  '</div>';

  const dogInner = document.getElementById("dogInner");
  dogInner.appendChild(dogRegistration);

}

function removeNewDog(currentDogs){
  if(newDog === currentDogs){
    alert("Cannot remove previously added dog")
  }else{
    const dogInner = document.getElementById("dogInner");
    var currentDogRegistration = "dogRegistration" + newDog;
    const dogRegistration = document.getElementById(currentDogRegistration);
    dogInner.removeChild(dogRegistration);
    newDog -= 1;
  }
}

function removeDog(){
  if(numberOfDogs === 1){
    alert("Dogs need to be at least 1")
  }else{
    const dogInner = document.getElementById("dogInner");
    var currentDogRegistration = "dogRegistration" + numberOfDogs;
    const dogRegistration = document.getElementById(currentDogRegistration);
    dogInner.removeChild(dogRegistration);
    numberOfDogs -= 1;
  }
}

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}


function loadFile(event, numberOfDogs){
  var outputName = "output" + numberOfDogs;
  var output = document.getElementById(outputName);
  output.src = URL.createObjectURL(event.target.files[0]);

  getDataUri(URL.createObjectURL(event.target.files[0]), function(dataUri) {
    var uriHolderName = "imageURI" + numberOfDogs;
    var dataURIHolder = document.getElementById(uriHolderName);
    dataURIHolder.value = dataUri;
});

  output.onload = function(){
    URL.revokeObjectURL(output.src)
  }

}

function loadPicture(event){
  var profileImage = document.getElementById("profileImage");
  profileImage.src = URL.createObjectURL(event.target.files[0]);

  getDataUri(URL.createObjectURL(event.target.files[0]), function(dataUri) {
    var dataURIHolder = document.getElementById("imageURI");
    dataURIHolder.value = dataUri;
  });

  profileImage.onload = function(){
    URL.revokeObjectURL(profileImage.src)
  }
}

function assignNumberOfDogs(){
  const e = document.getElementById("numberOfDogs");
  e.value = window.numberOfDogs;
}

function assignNewNumberOfDogs(currentDogs){
  const e = document.getElementById("numberOfNewDogs");
  e.value = window.newDog - currentDogs;
}

function removeDogField(){
  document.getElementById('dogForm').style.display = "none";
  document.getElementById('preferenceForm').style.display = "block";
}

function addDogField(){
  document.getElementById('dogForm').style.display = "block";
  document.getElementById('preferenceForm').style.display = "none";

}

function validateForm(){
  var userType = document.forms["registerForm"]["userType"].value;
  var userName = document.forms["registerForm"]["username"].value;
  var name = document.forms["registerForm"]["name"].value;
  var email = document.forms["registerForm"]["email"].value;
  var address = document.forms["registerForm"]["address"].value;
  var city = document.forms["registerForm"]["city"].value;
  var suburb = document.forms["registerForm"]["suburb"].value;
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
     }else if(city == "null"){
       alert("City must be filled before submitting form");
       return false;
     }else if(suburb == ""){
       alert("Suburb must be filled before submitting form");
       return false;
     }else{



     for(var i=1 ; i<= window.numberOfDogs ; i++){
       var name = "dogsName" + i;
       var breed = "dogsBreed" + i;
       var size = "dogsSize" + i;
       var weight = "dogsWeight" + i;
       var dateOfBirth = "dogsDateOfBirth" + i;


       var dogsName = document.forms["registerForm"][name].value;
       var dogsBreed = document.forms["registerForm"][breed].value;
       var dogsSize = document.forms["registerForm"][size].value;
       var dogsWeight = document.forms["registerForm"][weight].value;
       var dogsDateOfBirth = document.forms["registerForm"][dateOfBirth].value;

       if(dogsName == ""){
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
       }else if(dogsWeight > 200 || dogsWeight < 0){
         alert("Dog's weight minimum is 0kg and maximum is 200kg");
         return false;
       }else if(!Date.parse(dogsDateOfBirth)){
         alert("Dog's date of birth must be filled before submitting form");
         return false;
       }
     }

     if(password == ""){
       alert("Password must be filled before submitting form");
       return false;
     }
   }
     return true;
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
     }else if(city == "null"){
       alert("City must be filled before submitting form");
       return false;
     }else if(suburb == ""){
       alert("Suburb must be filled before submitting form");
       return false;
     }else if(password == ""){
       alert("Password must be filled before submitting form");
       return false;
     }

     return true;
   }
}

function validateProfileForm(userType, numberOfDogs){

  var name = document.forms["profileForm"]["name"].value;
  var email = document.forms["profileForm"]["emailAddress"].value;
  var address = document.forms["profileForm"]["address"].value;

   if(userType === "Dog Owner"){
     if(name == ""){
       alert("Name cannot be blank before submitting form");
       return false;
     }else if(email == ""){
       alert("Email cannot be blank before submitting form");
       return false;
     }else if(address == ""){
       alert("Address cannot be blank before submitting form");
       return false;
     }else{

     for(var i=1 ; i<= numberOfDogs ; i++){
       var name = "dogsName" + i;
       var weight = "dogsWeight" + i;


       var dogsName = document.forms["profileForm"][name].value;
       var dogsWeight = document.forms["profileForm"][weight].value;

       if(dogsName == ""){
         alert("Dog's name cannot be blank before submitting form");
         return false;
       }else if(dogsWeight == ""){
         alert("Dog's weight cannot be blank before submitting form");
         return false;
       }else if(dogsWeight > 200 || dogsWeight < 0){
         alert("Dog's weight minimum is 0kg and maximum is 200kg");
         return false;
       }
     }

     var currentDogs = numberOfDogs;
     for(var i=0 ; i < (newDog - numberOfDogs); i++){
       currentDogs++;
       var name = "newDogsName" + currentDogs;
       var breed = "newDogsBreed" + currentDogs;
       var size = "newDogsSize" + currentDogs;
       var weight = "newDogsWeight" + currentDogs;
       var dateOfBirth = "newDogsDateOfBirth" + currentDogs;

       var dogsName = document.forms["profileForm"][name].value;
      var dogsBreed = document.forms["profileForm"][breed].value;
      var dogsSize = document.forms["profileForm"][size].value;
      var dogsWeight = document.forms["profileForm"][weight].value;
      var dogsDateOfBirth = document.forms["profileForm"][dateOfBirth].value;

      if(dogsName == ""){
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
       }else if(dogsWeight > 200 || dogsWeight < 0){
         alert("Dog's weight minimum is 0kg and maximum is 200kg");
         return false;
       }else if(!Date.parse(dogsDateOfBirth)){
         alert("Dog's date of birth must be filled before submitting form");
         return false;
       }
     }

   }
     return true;
   }else if(userType === "Trainer"){
     if(name == ""){
       alert("Name must be filled before submitting form");
       return false;
     }else if(email == ""){
       alert("Email must be filled before submitting form");
       return false;
     }else if(address == ""){
       alert("Address must be filled before submitting form");
       return false;
     }

     return true;
   }
}

function removeSuburbOptions(){
  var length = document.getElementById("suburbInput").options.length -1;
  for(var i = length;i>=0;i--){
    document.getElementById("suburbInput").options.remove(i);
  }
}

function callAlert(){
alert("test");
}

function updateNumberOfDogs(){
  document.getElementById("numberOfDogs").value = numberOfDogs;
}



function suburbSelection(){
  var city =   document.getElementById('cityInput').value;
    switch(city){
      case 'Auckland':
            removeSuburbOptions();
            document.getElementById("suburbInput").options[0]=new Option("Arch Hill","Arch hill");
            document.getElementById("suburbInput").options[1]=new Option("Auckland CBD","Auckland CBD");
            document.getElementById("suburbInput").options[2]=new Option("Avondale","Avondale");
            document.getElementById("suburbInput").options[3]=new Option("Blackpool","Blackpool");
            document.getElementById("suburbInput").options[4]=new Option("Blockhouse Bay","Blockhouse Bay");
            document.getElementById("suburbInput").options[5]=new Option("Eden Terrace","Eden Valley");
            document.getElementById("suburbInput").options[6]=new Option("Ellerslie","Ellerslie");
            document.getElementById("suburbInput").options[7]=new Option("Epsom","Epsom");
            document.getElementById("suburbInput").options[8]=new Option("Freemans Bay","Freemans Bay");
            document.getElementById("suburbInput").options[9]=new Option("Glendowie","Glendowie");
            document.getElementById("suburbInput").options[10]=new Option("Glen Innes","Glen Innes");
            document.getElementById("suburbInput").options[11]=new Option("Grafton","Grafton");
            document.getElementById("suburbInput").options[12]=new Option("Greenlane","Greenlane");
            document.getElementById("suburbInput").options[13]=new Option("Greenwoods Corner","Greenwoods Corner");
            document.getElementById("suburbInput").options[14]=new Option("Grey Lynn","Grey Lynn");
            document.getElementById("suburbInput").options[15]=new Option("Herne Bay","Herne Bay");
            document.getElementById("suburbInput").options[16]=new Option("Hillsborough","Hillsborough");
            document.getElementById("suburbInput").options[17]=new Option("Kingsland","Kingsland");
            document.getElementById("suburbInput").options[18]=new Option("Kohimarama","Kohimarama");
            document.getElementById("suburbInput").options[19]=new Option("Lynfield","Lynfield");
            document.getElementById("suburbInput").options[20]=new Option("Meadowbank","Meadowbank");
            document.getElementById("suburbInput").options[21]=new Option("Mission Bay","Mission Bay");
            document.getElementById("suburbInput").options[22]=new Option("Morningside","Morningside");
            document.getElementById("suburbInput").options[23]=new Option("Mount Albert","Mount Albert");
            document.getElementById("suburbInput").options[24]=new Option("Mount Eden","Mount Eden");
            document.getElementById("suburbInput").options[25]=new Option("Mount Roskill","Mount Roskill");
            document.getElementById("suburbInput").options[26]=new Option("Mount Wellington","Mount Wellington");
            document.getElementById("suburbInput").options[27]=new Option("Newmarket","Newmarket");
            document.getElementById("suburbInput").options[28]=new Option("Newton","Newton");
            document.getElementById("suburbInput").options[29]=new Option("New Windsor","New Windsor");
            document.getElementById("suburbInput").options[30]=new Option("Onehunga","Onehunga");
            document.getElementById("suburbInput").options[31]=new Option("Oneroa","Oneroa");
            document.getElementById("suburbInput").options[32]=new Option("Onetangi","Onetangi");
            document.getElementById("suburbInput").options[33]=new Option("One Tree Hill","One Tree Hill");
            document.getElementById("suburbInput").options[34]=new Option("Orakei","Orakei");
            document.getElementById("suburbInput").options[35]=new Option("Oranga","Oranga");
            document.getElementById("suburbInput").options[36]=new Option("Ostend","Ostend");
            document.getElementById("suburbInput").options[37]=new Option("Ōtāhuhu","Ōtāhuhu");
            document.getElementById("suburbInput").options[38]=new Option("Owairaka","Owairaka");
            document.getElementById("suburbInput").options[39]=new Option("Palm Beach","Palm Beach");
            document.getElementById("suburbInput").options[40]=new Option("Panmure","Panmure");
            document.getElementById("suburbInput").options[41]=new Option("Parnell","Parnell");
            document.getElementById("suburbInput").options[42]=new Option("Penrose","Penrose");
            document.getElementById("suburbInput").options[43]=new Option("Point England","Point England");
            document.getElementById("suburbInput").options[44]=new Option("Point Chevalier","Point Chevalier");
            document.getElementById("suburbInput").options[45]=new Option("Ponsonby","Ponsonby");
            document.getElementById("suburbInput").options[46]=new Option("Remuera","Remuera");
            document.getElementById("suburbInput").options[47]=new Option("Royal Oak","Royal Oak");
            document.getElementById("suburbInput").options[48]=new Option("Saint Heliers","Saint Heliers");
            document.getElementById("suburbInput").options[49]=new Option("St Johns","St Johns");
            document.getElementById("suburbInput").options[50]=new Option("Saint Marys Bay","Saint Marys Bay");
            document.getElementById("suburbInput").options[51]=new Option("Sandringham","Sandringham");
            document.getElementById("suburbInput").options[52]=new Option("Stonefields","Stonefields");
            document.getElementById("suburbInput").options[53]=new Option("Surfdale","Surfdale");
            document.getElementById("suburbInput").options[54]=new Option("Tamaki","Tamaki");
            document.getElementById("suburbInput").options[55]=new Option("Te Papapa","Te Papapa");
            document.getElementById("suburbInput").options[56]=new Option("Three Kings","Three Kings");
            document.getElementById("suburbInput").options[57]=new Option("Waikowhai","Waikowhai");
            document.getElementById("suburbInput").options[58]=new Option("Wai o Taiki Bay","Wai o Taiki Bay");
            document.getElementById("suburbInput").options[59]=new Option("Waterview","Waterview");
            document.getElementById("suburbInput").options[60]=new Option("Western Springs","Western Springs");
            document.getElementById("suburbInput").options[61]=new Option("Westfield","Westfield");
            document.getElementById("suburbInput").options[62]=new Option("Westmere","Westmere");

        break;
      case 'Wellington':
            removeSuburbOptions();
            document.getElementById("suburbInput").options[0]=new Option("Aro Valley","Aro Valley");
            document.getElementById("suburbInput").options[1]=new Option("Berhampore","Berhampore");
            document.getElementById("suburbInput").options[2]=new Option("Breaker Bay","Breaker Bay");
            document.getElementById("suburbInput").options[3]=new Option("Broadmeadows","Broadmeadows");
            document.getElementById("suburbInput").options[4]=new Option("Brooklyn","Brooklyn");
            document.getElementById("suburbInput").options[5]=new Option("Churton Park","Churton Park");
            document.getElementById("suburbInput").options[6]=new Option("Crofton Downs","Crofton Downs");
            document.getElementById("suburbInput").options[7]=new Option("Glenside","Glenside");
            document.getElementById("suburbInput").options[8]=new Option("Grenada North","Grenada North");
            document.getElementById("suburbInput").options[9]=new Option("Grenada Village","Grenada Village");
            document.getElementById("suburbInput").options[10]=new Option("Hataitai","Hataitai");
            document.getElementById("suburbInput").options[11]=new Option("Highbury","Highbury");
            document.getElementById("suburbInput").options[12]=new Option("Horokiwi","Horokiwi");
            document.getElementById("suburbInput").options[13]=new Option("Houghton Bay","Houghton Bay");
            document.getElementById("suburbInput").options[14]=new Option("Island Bay","Island Bay");
            document.getElementById("suburbInput").options[15]=new Option("Johnsonville","Johnsonville");
            document.getElementById("suburbInput").options[16]=new Option("Kaiwharawhara","Kaiwharawhara");
            document.getElementById("suburbInput").options[17]=new Option("Karaka Bays","Karaka Bays");
            document.getElementById("suburbInput").options[18]=new Option("Karori","Karori");
            document.getElementById("suburbInput").options[19]=new Option("Kelburn","Kelburn");
            document.getElementById("suburbInput").options[20]=new Option("Khandallah","Khandallah");
            document.getElementById("suburbInput").options[21]=new Option("Kilbirnie","Kilbirnie");
            document.getElementById("suburbInput").options[22]=new Option("Kingston","Kingston");
            document.getElementById("suburbInput").options[23]=new Option("Lyall Bay","Lyall Bay");
            document.getElementById("suburbInput").options[24]=new Option("Maupuia","Maupuia");
            document.getElementById("suburbInput").options[25]=new Option("Melrose","Melrose");
            document.getElementById("suburbInput").options[26]=new Option("Miramar","Miramar");
            document.getElementById("suburbInput").options[27]=new Option("Moa Point","Moa Point");
            document.getElementById("suburbInput").options[28]=new Option("Mornington","Mornington");
            document.getElementById("suburbInput").options[29]=new Option("Mount Cook","Mount Cook");
            document.getElementById("suburbInput").options[30]=new Option("Mount Victoria","Mount Victoria");
            document.getElementById("suburbInput").options[31]=new Option("Newlands","Newlands");
            document.getElementById("suburbInput").options[32]=new Option("Newtown","Newtown");
            document.getElementById("suburbInput").options[33]=new Option("Ngaio","Ngaio");
            document.getElementById("suburbInput").options[34]=new Option("Ngauranga","Ngauranga");
            document.getElementById("suburbInput").options[35]=new Option("Northland","Northland");
            document.getElementById("suburbInput").options[36]=new Option("Ohariu","Ohariu");
            document.getElementById("suburbInput").options[37]=new Option("Oriental Bay","Oriental Bay");
            document.getElementById("suburbInput").options[38]=new Option("Owhiro Bay","Owhiro Bay");
            document.getElementById("suburbInput").options[39]=new Option("Paparangi","Paparangi");
            document.getElementById("suburbInput").options[40]=new Option("Pipitea","Pipitea");
            document.getElementById("suburbInput").options[41]=new Option("Rongotai","Rongotai");
            document.getElementById("suburbInput").options[42]=new Option("Roseneath","Roseneath");
            document.getElementById("suburbInput").options[43]=new Option("Seatoun","Seatoun");
            document.getElementById("suburbInput").options[44]=new Option("Southgate","Southgate");
            document.getElementById("suburbInput").options[45]=new Option("Strathmore Park","Strathmore Park");
            document.getElementById("suburbInput").options[46]=new Option("Takapu Valley","Takapu Valley");
            document.getElementById("suburbInput").options[47]=new Option("Tawa","Tawa");
            document.getElementById("suburbInput").options[48]=new Option("Te Aro","Te Aro");
            document.getElementById("suburbInput").options[49]=new Option("Thorndon","Thorndon");
            document.getElementById("suburbInput").options[50]=new Option("Vogeltown","Vogeltown");
            document.getElementById("suburbInput").options[51]=new Option("Wadestown","Wadestown");
            document.getElementById("suburbInput").options[52]=new Option("Wellington Central","Wellington Central");
            document.getElementById("suburbInput").options[53]=new Option("Wilton","Wilton");
            document.getElementById("suburbInput").options[54]=new Option("Woodridge","Woodridge");
      break;
      case 'Christchurch':
            removeSuburbOptions();
            document.getElementById("suburbInput").options[0]=new Option("Addington","Addington");
            document.getElementById("suburbInput").options[1]=new Option("Aranui","Aranui");
            document.getElementById("suburbInput").options[2]=new Option("Avondale","Avondale");
            document.getElementById("suburbInput").options[3]=new Option("Avonhead","Avonhead");
            document.getElementById("suburbInput").options[4]=new Option("Avonside","Avonside");
            document.getElementById("suburbInput").options[5]=new Option("Beckenham","Beckenham");
            document.getElementById("suburbInput").options[6]=new Option("Belfast","Belfast");
            document.getElementById("suburbInput").options[7]=new Option("Bexley","Bexley");
            document.getElementById("suburbInput").options[8]=new Option("Bishopdale","Bishopdale");
            document.getElementById("suburbInput").options[9]=new Option("Bottle Lake","Bottle Lake");
            document.getElementById("suburbInput").options[10]=new Option("Bromley","Bromley");
            document.getElementById("suburbInput").options[11]=new Option("Brooklands","Brooklands");
            document.getElementById("suburbInput").options[12]=new Option("Broomfield","Broomfield");
            document.getElementById("suburbInput").options[13]=new Option("Bryndwr","Bryndwr");
            document.getElementById("suburbInput").options[14]=new Option("Burnside","Burnside");
            document.getElementById("suburbInput").options[15]=new Option("Burwood","Burwood");
            document.getElementById("suburbInput").options[16]=new Option("Casebrook","Casebrook");
            document.getElementById("suburbInput").options[17]=new Option("Cashmere","Cashmere");
            document.getElementById("suburbInput").options[18]=new Option("Christchurch Airport","Christchurch Airport");
            document.getElementById("suburbInput").options[19]=new Option("Christchurch Central","Christchurch Central");
            document.getElementById("suburbInput").options[20]=new Option("Clifton","Clifton");
            document.getElementById("suburbInput").options[21]=new Option("Cracroft","Cracroft");
            document.getElementById("suburbInput").options[22]=new Option("Dallington","Dallington");
            document.getElementById("suburbInput").options[23]=new Option("Edgeware","Edgeware");
            document.getElementById("suburbInput").options[24]=new Option("Fendalton","Fendalton");
            document.getElementById("suburbInput").options[25]=new Option("Ferrymead","Ferrymead");
            document.getElementById("suburbInput").options[26]=new Option("Halswell","Halswell");
            document.getElementById("suburbInput").options[27]=new Option("Harewood","Harewood");
            document.getElementById("suburbInput").options[28]=new Option("Heathcote Valley","Heathcote Valley");
            document.getElementById("suburbInput").options[29]=new Option("Hei Hei","Hei Hei");
            document.getElementById("suburbInput").options[30]=new Option("Hillmorton","Hillmorton");
            document.getElementById("suburbInput").options[31]=new Option("Hillsborough","Hillsborough");
            document.getElementById("suburbInput").options[32]=new Option("Hoon Hay","Hoon Hay");
            document.getElementById("suburbInput").options[33]=new Option("Hornby","Hornby");
            document.getElementById("suburbInput").options[34]=new Option("Hornby South","Hornby South");
            document.getElementById("suburbInput").options[35]=new Option("Huntsbury","Huntsbury");
            document.getElementById("suburbInput").options[36]=new Option("Ilam","Ilam");
            document.getElementById("suburbInput").options[37]=new Option("Islington","Islington");
            document.getElementById("suburbInput").options[38]=new Option("Kainga","Kainga");
            document.getElementById("suburbInput").options[39]=new Option("Kennedys Bush","Kennedys Bush");
            document.getElementById("suburbInput").options[40]=new Option("Linwood","Linwood");
            document.getElementById("suburbInput").options[41]=new Option("Mairehau","Mairehau");
            document.getElementById("suburbInput").options[42]=new Option("Marshland","Marshland");
            document.getElementById("suburbInput").options[43]=new Option("Mcleans Island","Mcleans Island");
            document.getElementById("suburbInput").options[44]=new Option("Merivale","Merivale");
            document.getElementById("suburbInput").options[45]=new Option("Middleton","Middleton");
            document.getElementById("suburbInput").options[46]=new Option("Moncks Bay","Moncks Bay");
            document.getElementById("suburbInput").options[47]=new Option("Mount Pleasant","Mount Pleasant");
            document.getElementById("suburbInput").options[48]=new Option("New Brighton","New Brighton");
            document.getElementById("suburbInput").options[49]=new Option("North New Brighton","North New Brighton");
            document.getElementById("suburbInput").options[50]=new Option("Northcote","Northcote");
            document.getElementById("suburbInput").options[51]=new Option("Northwood","Northwood");
            document.getElementById("suburbInput").options[52]=new Option("Opawa","Opawa");
            document.getElementById("suburbInput").options[53]=new Option("Papanui","Papanui");
            document.getElementById("suburbInput").options[54]=new Option("Parklands","Parklands");
            document.getElementById("suburbInput").options[55]=new Option("Phillipstown","Phillipstown");
            document.getElementById("suburbInput").options[56]=new Option("Redcliffs","Redcliffs");
            document.getElementById("suburbInput").options[57]=new Option("Redwood","Redwood");
            document.getElementById("suburbInput").options[58]=new Option("Riccarton","Riccarton");
            document.getElementById("suburbInput").options[59]=new Option("Richmond","Richmond");
            document.getElementById("suburbInput").options[60]=new Option("Richmond Hill","Richmond Hill");
            document.getElementById("suburbInput").options[61]=new Option("Russley","Russley");
            document.getElementById("suburbInput").options[62]=new Option("Saint Albans","Saint Albans");
            document.getElementById("suburbInput").options[63]=new Option("Saint Martins","Saint Martins");
            document.getElementById("suburbInput").options[64]=new Option("Shirley","Shirley");
            document.getElementById("suburbInput").options[65]=new Option("Sockburn","Sockburn");
            document.getElementById("suburbInput").options[66]=new Option("Somerfield","Somerfield");
            document.getElementById("suburbInput").options[67]=new Option("South New Brighton","South New Brighton");
            document.getElementById("suburbInput").options[68]=new Option("Southshore","Southshore");
            document.getElementById("suburbInput").options[69]=new Option("Spreydon","Spreydon");
            document.getElementById("suburbInput").options[70]=new Option("Strowan","Strowan");
            document.getElementById("suburbInput").options[71]=new Option("Styx","Styx");
            document.getElementById("suburbInput").options[72]=new Option("Sumner","Sumner");
            document.getElementById("suburbInput").options[73]=new Option("Sydenham","Sydenham");
            document.getElementById("suburbInput").options[74]=new Option("Templeton","Templeton");
            document.getElementById("suburbInput").options[75]=new Option("Upper Riccarton","Upper Riccarton");
            document.getElementById("suburbInput").options[76]=new Option("Waimairi Beach","Waimairi Beach");
            document.getElementById("suburbInput").options[77]=new Option("Wainoni","Wainoni");
            document.getElementById("suburbInput").options[78]=new Option("Waltham","Waltham");
            document.getElementById("suburbInput").options[79]=new Option("Westmorland","Westmorland");
            document.getElementById("suburbInput").options[80]=new Option("Wigram","Wigram");
            document.getElementById("suburbInput").options[81]=new Option("Woolston","Woolston");
            document.getElementById("suburbInput").options[82]=new Option("Yaldhurst","Yaldhurst");
      break;
    }
}


function formatDate(date) {
var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

if (month.length < 2)
    month = '0' + month;
if (day.length < 2)
    day = '0' + day;

return [year, month, day].join('-');
}
