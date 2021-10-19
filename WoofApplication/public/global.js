let directionsService;
let directionsDisplay;
var mapDIV = document.getElementById('map');
var coordinate;
var map;
var markersArray = [];
var destination;
var infowindow = null;

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
   },(function(){
     return function(results, status) {
        coordinate = results[0].geometry.location;
       if (status == 'OK') {
         map.setCenter(results[0].geometry.location);

         var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            draggable: false
        });







        const calculateDiv = document.createElement("div");
        CalculateControl(calculateDiv);
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(calculateDiv);

        ShowEventControl();

        new ClickEventHandler(map, {lat : coordinate.lat(), lng : coordinate.lng()}, destination);

       }else{
         alert('Geocode was not successful for the following reason: ' + status);
       }
   }
 }()));


}


function alternateImage(event){
  const target = event.target;
  target.src = "/img/undraw_profile.svg";
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
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

function alternateImage(event){
  const target = event.target;
  target.src = "/img/undraw_profile.svg";
}

function joinInvitation(event, invitationID,type){
  window.open("/join/" + type + "/" + invitationID,"_self");
}

function deleteInvitation(event, invitationID){
  window.open("/delete/invitation/" + invitationID,"_self");
}

function isIconMouseEvent(e) {
  return "placeId" in e;
}

function deleteReminder(name){
  var reminder = document.getElementById(name);
  reminder.remove();
}


class ClickEventHandler {
  origin;
  map;
  directionsService;
  directionsRenderer;
  placesService;
  infowindow;
  infowindowContent;
  destination;
  constructor(map, origin,destination) {
    this.origin = origin;
    this.map = map;
    this.destination = destination;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);
    this.placesService = new google.maps.places.PlacesService(map);
    this.infowindow = new google.maps.InfoWindow();
    this.infowindowContent = document.getElementById("infowindow-content");
    this.infowindow.setContent(this.infowindowContent);
    // Listen for clicks on the map.
    this.map.addListener("click", this.handleClick.bind(this));
  }
  handleClick(event) {
    console.log("You clicked on: " + event.latLng);

    // If the event has a placeId, use it.
    if (isIconMouseEvent(event)) {
      console.log("You clicked on place:" + event.placeId);

      if (event.placeId) {
          destination = event.latLng;
      }
    }
  }
}
