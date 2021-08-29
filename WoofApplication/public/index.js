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
  var city = document.forms["registerForm"]["city"].value;
  var suburb = document.forms["registerForm"]["suburb"].value;
  var dogsName = document.forms["registerForm"]["dogsName"].value;
  var dogsBreed = document.forms["registerForm"]["dogsBreed"].value;
  var dogsSize = document.forms["registerForm"]["dogsSize"].value;
  var dogsWeight = document.forms["registerForm"]["dogsWeight"].value;
  var dogsDateOfBirth = document.forms["registerForm"]["dogsDateOfBirth"].value;
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
     }else if(dogsWeight > 100){
       alert("Dog's weight maximum is 100kg");
     }else if(!Date.parse(dogsDateOfBirth)){
       alert("Dog's date of birth must be filled before submitting form");
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
   }else{
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



function suburbSelection(city){

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
