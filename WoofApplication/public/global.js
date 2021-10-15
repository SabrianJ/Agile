let directionsService;
let directionsDisplay;
var mapDIV = document.getElementById('map');
var coordinate;
var map;
var markersArray = [];
var destination;


function initialize() {
  var input = document.getElementById('addressInput');

  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.setComponentRestrictions({
   country: ["nz"],
 });

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();

      let city = place.address_components[3].long_name;

      if(city === "Auckland" || city === "Christchurch" || city === "Wellington"){
        document.getElementById('cityInput').value = place.address_components[3].long_name;
        document.getElementById("suburbInput").options[0]=new Option(place.address_components[2].long_name,place.address_components[2].long_name);
        document.getElementById('suburbInput').value = place.address_components[2].long_name;
      }else{
        alert("Only Auckland, Wellington and Christchurch that is supported by this app");
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

function isIconMouseEvent(e) {
  return "placeId" in e;
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
