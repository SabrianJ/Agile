const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const findOrCreate = require("mongoose-findorcreate");
const _ = require("lodash");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const cloudinary = require("cloudinary").v2;
const nocache = require('nocache');

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

app.use(session({
  secret: "WoofApplication.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(nocache());


mongoose.connect("mongodb+srv://admin-Sabrian:Sabrianjs1302@cluster0.p9zmt.mongodb.net/woof", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

cloudinary.config({
  cloud_name: 'woof2021',
  api_key: '994115692726124',
  api_secret: '-pNnbwpwncgA3FVxlDn_pfGYi2E',
  secure: true
});

const dogsSchema = new mongoose.Schema({
  name: String,
  breed: String,
  size: String,
  weight: String,
  dob: Date,
  owner: String
});

const usersSchema = new mongoose.Schema({
  userName: String,
  name: String,
  email: String,
  address: String,
  city: String,
  suburb: String,
  type: String,
  preference: Array,
  distance: String,
  password: String
});

const activitySchema = new mongoose.Schema({
  location: String,
  dateTime : Date,
  name: String,
  description: String,
  member: Array,
  creator: String
});

const groupSchema = new mongoose.Schema({
  name : String,
  member : [String],
  description : String,
  admin : String
});

const eventSchema = new mongoose.Schema({
  location: String,
  dateTime: Date,
  name : String,
  description : String,
  member : Array,
  creator : String
});

const trainingSchema = new mongoose.Schema({
  location : String,
  dateTime : Date,
  name : String,
  description : String,
  member: Array,
  creator : String
});

const invitationSchema = new mongoose.Schema({
  name: String,
  type: String,
  targetID : String,
  owner: String,
  message: String
});

usersSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", usersSchema);
const Dog = new mongoose.model("Dog", dogsSchema);
const Activity = new mongoose.model("Activity", activitySchema);
const Group = new mongoose.model("Group", groupSchema);
const Event = new mongoose.model("Event", eventSchema);
const Training = new mongoose.model("Training", trainingSchema);
const Invitation = new mongoose.model("Invitation", invitationSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.get("/login", function(req, res) {

  res.render("login", {
    errorMessage: ""
  });
});

app.get("/register", function(req, res) {
  res.render("register",{
    errorMessage: ""
  });
});

app.get("/googleaa6c330e01886bd6.html", function(req, res) {
  res.render("googleaa6c330e01886bd6");
});

app.get("/createActivity", function(req, res) {
  if (req.isAuthenticated()) {

    User.find({type : "Dog Owner"}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
          var dogOwners = [];
          for(var i=0; i < foundUser.length ; i++){
            if(req.user.username === foundUser[i].username){

              continue;
            }else{
              dogOwners.push(foundUser[i]);
            }
          }

          Invitation.find({owner : req.user._id}, function(err,foundInvitation){
            if(err){
              console.log(err);
            }else{
              res.render("createActivity", {user: req.user, foundInvitation : foundInvitation, dogOwners : dogOwners});
            }
          });
        }
      }
    );
  } else {
    res.redirect("login");
  }
});

app.get("/leave/group/:groupID",function(req,res){
  if(req.isAuthenticated()){
    Group.updateOne({_id : req.params.groupID}, { $pull : {member : req.user._id}},function(err,result){
      if(err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
  }else{
    res.redirect("login");
  }
});

app.get("/editActivity", function(req, res) {
  if (req.isAuthenticated()) {

    Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("editActivity", {user: req.user, foundInvitation : foundInvitation});
      }
    });

  } else {
    res.redirect("login");
  }
});

app.get("/createGroup", function(req, res) {
  if (req.isAuthenticated()) {

    User.find({type : "Dog Owner"}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
          var dogOwners = [];
          for(var i=0; i < foundUser.length ; i++){
            if(req.user.username === foundUser[i].username){

              continue;
            }else{
              dogOwners.push(foundUser[i]);
            }
          }

          Invitation.find({owner : req.user._id}, function(err,foundInvitation){
            if(err){
              console.log(err);
            }else{
              res.render("createGroup",{user : req.user, dogOwners : dogOwners, foundInvitation : foundInvitation});
            }
          });


        }
      }
    );
  } else {
    res.redirect("login");
  }
});

app.post("/createGroup", function(req,res){
  var group = new Group({
    name : req.body.name,
    member : [],
    description : req.body.description,
    admin : req.user._id
  });

  group.save(function(err,result){
    if(err){
      console.log(err);
    }
  });

  var owners = req.body.owners;


for(var i=0 ; i < owners.length ; i++){
  var invitation = new Invitation({
    name: req.body.name,
    type: "Group",
    targetID: group._id,
    owner: owners[i],
    message: req.body.message
  });

  invitation.save(function(err,result){
    if(err){
      console.log(err);
    }
  });
}

res.redirect("/");
});

app.get("/groups/edit/:groupID", function(req,res){
  const groupID = req.params.groupID;
  if(req.isAuthenticated()){
    User.find({type : "Dog Owner"}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
          var dogOwners = [];
          for(var i=0; i < foundUser.length ; i++){
            if(req.user.username === foundUser[i].username){
              continue;
            }else{
              dogOwners.push(foundUser[i]);
            }
          }

          Invitation.find({owner : req.user._id}, function(err,foundInvitation){
            if(err){
              console.log(err);
            }else{
              Group.find({_id : groupID}, function(err, foundGroup){
                if(err){
                  console.log(err);
                }else{
                  res.render("editGroup",{user : req.user, dogOwners : dogOwners, foundInvitation : foundInvitation , foundGroup : foundGroup});
                }
              });
            }
          });
        }
      });
  }else{
    res.redirect("login");
  }
});

app.post("/groups/edit/:groupID",function(req,res){
  const groupID = req.params.groupID;
  const currentOwnersExclude = req.body.currentOwnersExclude;
  if(currentOwnersExclude != null){
    for(var i=0 ; i < currentOwnersExclude.length ; i++){
      Group.findByIdAndUpdate(groupID, {$pull : {member : currentOwnersExclude[i]}},function(error,result){
        if(error){
          console.log(error);
        }
      });
    }
  }


  Group.findByIdAndUpdate(groupID, {
    name : req.body.name,
    description : req.body.description
  }, function(error,result){
    if(error){
      console.log(error);
    }
  });

  var newOwners = req.body.newOwners;

  if(newOwners != null){
    for(var i=0 ; i < newOwners.length ; i++){
      var invitation = new Invitation({
        name: req.body.name,
        type: "Group",
        targetID: groupID,
        owner: newOwners[i],
        message: req.body.message
      });

      invitation.save(function(err,result){
        if(err){
          console.log(err);
        }
      });
    }
  }



  res.redirect("/");

});


app.get("/join/Group/:invitationID", function(req,res){
  const invitationID = req.params.invitationID;
  if(req.isAuthenticated()){
    Invitation.find({_id : invitationID},function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        const invitation = foundInvitation[0];

          Group.findByIdAndUpdate(invitation.targetID, {$push : {"member" : invitation.owner}},
          {safe: true, upsert: true, new : true}, function(error,result){
            if(error){
              console.log(error);
            }else{
              Invitation.findByIdAndRemove(invitation._id,function(er,success){
                if(er){
                  console.log(er);
                }else{
                  res.redirect("/");
                }
              });

            }
          });

      }
    });
  }else{
    res.redirect("/login");
  }
});

app.get("/delete/invitation/:invitationID",function(req,res){
  const invitationID = req.params.invitationID;
  if(req.isAuthenticated()){
    Invitation.findByIdAndRemove(invitationID,function(err,result){
      if(err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
  }
});

app.get("/delete/group/:groupID",function(req,res){
  const groupID = req.params.groupID;
  if(req.isAuthenticated()){
    Group.findByIdAndRemove(groupID, function(err,result){
      if(err){
        console.log(err);
      }else{
        res.redirect("/");
      }
    });
  }
});

app.get("/createEvent", function(req, res) {
  if (req.isAuthenticated()) {

    Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("createEvent", {user: req.user, foundInvitation : foundInvitation});
      }
    });

  } else {
    res.redirect("login");
  }
});

app.get("/editEvent", function(req, res) {
  if (req.isAuthenticated()) {

    Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("editEvent", {user: req.user, foundInvitation : foundInvitation});
      }
    });

  } else {
    res.redirect("login");
  }
});

app.get("/createTraining", function(req, res) {
  if (req.isAuthenticated()) {

    Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("createTraining", {user: req.user, foundInvitation : foundInvitation});
      }
    });

  } else {
    res.redirect("login");
  }
});

app.get("/editTraining", function(req, res) {
  if (req.isAuthenticated()) {

    Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("editTraining", {user: req.user, foundInvitation : foundInvitation});
      }
    });

  } else {
    res.redirect("login");
  }
});


app.post("/register", function(req, res) {
  if(req.body.userType === "Dog Owner"){
    User.register(new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      suburb : req.body.suburb,
      distance : req.body.distance,
      type: req.body.userType
    }), req.body.password, function(err, user) {
      if (err) {
        console.log(err);

        res.render("register",{
          errorMessage: err
        });

      } else {
        passport.authenticate("local")(req, res, function() {

          var numberOfDogs = req.body.numberOfDogs;
          console.log(numberOfDogs);

          for(var i=1; i <= numberOfDogs ; i++){
            var currentName = 'req.body.dogsName' + i;
            var currentBreed = 'req.body.dogsBreed' + i;
            var currentSize = 'req.body.dogsSize' + i;
            var currentWeight = 'req.body.dogsWeight' + i;
            var currentDob = 'req.body.dogsDateOfBirth' + i;

            var dog = new Dog({
              name: eval(currentName),
              breed: eval(currentBreed),
              size: eval(currentSize),
              weight: eval(currentWeight),
              dob: eval(currentDob),
              owner: req.user._id
            });
            dog.save(function(err,result){
              if(err){
                console.log(err);
              }
            });

            var imageURIName = "req.body.imageURI" + i;

            var uploadedResponse = cloudinary.uploader.upload(eval(imageURIName),{
              upload_preset: 'dogsImage',
              public_id : dog._id
            });

          }
          res.redirect("/");
        });
      }
    });
  }else if(req.body.userType === "Trainer"){
    User.register(new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      suburb : req.body.suburb,
      distance : req.body.distance,
      preference: req.body.preferences,
      type: req.body.userType
    }), req.body.password, function(err, user) {
      if (err) {

        console.log(err);

        res.render("register",{
          errorMessage: err
        });

      } else {
        passport.authenticate("local")(req, res, function() {
              res.redirect("/");
        })
      }
    });
      }
    });

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

app.get("/deleteUser", function(req,res){
  if(req.isAuthenticated()){
    if(req.user.type == "Dog Owner"){
      Dog.find({owner : req.user._id}, function(err, dogs){
        for(var i=0;i< dogs.length; i++){

          cloudinary.uploader.destroy('dogsImage/' + dogs[i]._id, function(error,result) {
  console.log(result, error) });


          Dog.findByIdAndRemove(dogs[i]._id, function(err){
            if(err){
              console.log(err);
            }
          })
        }

        User.findByIdAndRemove(req.user._id,function(error){
          if(error){
            console.log(error);
          }else{
            req.logout();
            res.redirect("/login");
          }
        });
      });
    }else{
      User.findByIdAndRemove(req.user._id,function(error){
        if(error){
          console.log(error);
        }else{
          req.logout();
          res.redirect("/login");
        }
      });
    }
  }else{
    res.redirect("login")
  }
});


app.get("/updateProfile", function(req, res) {
  if (req.isAuthenticated()) {
    if(req.user.type == "Dog Owner"){
      Dog.find({owner : req.user._id}, function(err,dogs){
        console.log(formatDate(dogs[0].dob));
        var dogsDOB = [];

        for(var i=0; i<dogs.length ; i++){
          dogsDOB.push(formatDate(dogs[i].dob));
        }

        Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("updateProfile", {user: req.user, foundInvitation : foundInvitation, dogs : dogs, success : null, dogsDOB : dogsDOB});
      }
    });
      });
    }else{

      Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("updateProfile", {user: req.user, foundInvitation : foundInvitation, success : null});
      }
    });
    }
  } else {
    res.redirect("login");
  }
});

app.get("/dogOwners", function(req, res) {

  if (req.isAuthenticated()) {
    User.find({type : "Dog Owner"}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        var dogAndOwner = [];
            dogAndOwner = allocateDogsOwner(dogAndOwner,foundUser);
            dogAndOwner.then(results =>{

              Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("dogOwners", {user: req.user, foundInvitation : foundInvitation, results : results});
      }
    });

            }).catch(err =>{console.log(err)})
        }
      }
    );
  } else {
    res.redirect("login");
  }
});

async function allocateDogsOwner(dogAndOwner, foundUser){
  for(var i=0; i<foundUser.length ;i++){
    await Dog.find({owner : foundUser[i]._id}).exec().then(value=>{
      var dogOwner = {
        user : foundUser[i],
        dog : value
      };
      dogAndOwner.push(dogOwner);
    }).catch(err=>{console.log(err)});
  }
  return dogAndOwner;

}

app.get("/trainers", function(req, res) {
  if (req.isAuthenticated()) {
    User.find({type : "Trainer"}, function(err,results){
      if(err){
        console.log(err);
      }else{

        Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("trainers", {user: req.user, foundInvitation : foundInvitation, results : results});
      }
    });
      }
    });
  } else {
    res.redirect("login");
  }
});

app.get("/trainers/:trainerID", function(req, res) {
  const trainerID = req.params.trainerID;

  if (req.isAuthenticated()) {
    User.find({_id : trainerID}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{

        Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("trainer", {user: req.user, foundInvitation : foundInvitation, foundUser : foundUser});
      }
    });

      }
    });
  } else {
    res.redirect("login");
  }
});

function calculate_age(dob){
  var diff_ms = new Date().getFullYear() - new Date(dob).getFullYear();
  return diff_ms;

}

app.get("/dogOwners/:dogOwnerID", function(req, res) {
  const dogOwnerID = req.params.dogOwnerID;

  if (req.isAuthenticated()) {
    User.find({_id : dogOwnerID}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
         Dog.find({owner : foundUser[0]._id},function(error,dog){
           if(error){
             console.log(error);
           }else{
             var dogAges = [];
             for(var i=0 ; i < dog.length ; i++){
               dogAges.push(calculate_age(dog[i].dob));
             }

             Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("dogOwner", {user: req.user, foundInvitation : foundInvitation, foundUser : foundUser, dog : dog, dogAges: dogAges});
      }
    });
           }
         });
      }
    });
  } else {
    res.redirect("login");
  }
});

app.post("/updateProfile", function(req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/login')
  } else {

    User.findByIdAndUpdate(req.user._id, {
      name: req.body.name
    }, function(err, docs) {
      if (err) {
        console.log(err);
      }
    });

    User.findByIdAndUpdate(req.user._id, {
      email: req.body.emailAddress
    }, function(err, docs) {
      if (err) {
        console.log(err);
      }
    });

    User.findByIdAndUpdate(req.user._id, {
      address: req.body.address
    }, function(err, docs) {
      if (err) {
        console.log(err);
      }
    });

    User.findByIdAndUpdate(req.user._id, {
      distance: req.body.distance
    }, function(err, docs) {
      if (err) {
        console.log(err);
      }
    });

if(req.body.city != null){
  User.findByIdAndUpdate(req.user._id, {
    city: req.body.city
  }, function(err, docs) {
    if (err) {
      console.log(err);
    }else{
      console.log(req.body.city);
    }
  });
}

    if(req.body.suburb != null){
      User.findByIdAndUpdate(req.user._id, {
        suburb: req.body.suburb
      }, function(err, docs) {
        if (err) {
          console.log(err);
        }else{
          console.log(req.body.suburb);
        }
      });
    }



    if(req.user.type === "Dog Owner"){
      Dog.find({owner : req.user._id}, function(err, dogs) {
        if (err) {
          console.log(err);

          Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("updateProfile", {user: req.user, foundInvitation : foundInvitation, dogs : dogs, success : false});
      }
    });
        }else{

          var dogsDOB = [];

          for(var i=0; i<dogs.length ; i++){
            dogsDOB.push(formatDate(dogs[i].dob));
          }




          for(var i = 0; i < dogs.length ; i++){
            var j = i+1;

            const name = "req.body.dogsName" + j;
            const breed = "req.body.dogsBreed" + j;
            const size = "req.body.dogsSize" + j;
            const weight = "req.body.dogsWeight" + j;
            const dob = "req.body.dogsDateOfBirth" + j;
            Dog.findByIdAndUpdate(dogs[i]._id,{
              name : eval(name),
              size : eval(size),
              weight : eval(weight),
              dob : eval(dob)
            }, function(err,docs){
              if(err){
                  console.log(err);
              }
            });

            if(eval(breed) != null){
              Dog.findByIdAndUpdate(dogs[i]._id,{
                breed : eval(breed)
              }, function(err,docs){
                if(err){
                    console.log(err);
                }
              });
            }

            var imageURIName = "req.body.imageURI" + j;

            if(eval(imageURIName) != null){
              var uploadedResponse = cloudinary.uploader.upload(eval(imageURIName),{
                upload_preset: 'dogsImage',
                public_id : dogs[i]._id
              });
            }



          }
            res.redirect('/updateProfile');
        }
      });
    }else{
      User.findByIdAndUpdate(req.user._id, {
        preference: req.body.preferences
      }, function(err, docs) {
        if (err) {
          console.log(err);
        }
      });
        res.redirect('/updateProfile');
    }
  }
});

app.get("/changePassword", function(req, res) {
  if (req.isAuthenticated()) {

    Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("changePassword", {user: req.user, foundInvitation : foundInvitation, success: null});
      }
    });

  } else {
    res.redirect("login");
  }
});

app.post("/changePassword", function(req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/login')
  } else {
    User.findOne({
      _id: req.user._id
    }, function(err, user) {
      if (!err) {
        user.changePassword(req.body.oldPassword, req.body.newPassword, function(err) {
          if (err) {

            Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("changePassword", {user: req.user, foundInvitation : foundInvitation, success: false});
      }
    });

            console.log(err);
          } else {

            Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("changePassword", {user: req.user, foundInvitation : foundInvitation, success: true});
      }
    });

          }
        })
      } else {
        console.log(err);
      }
    });
  }
});




app.post("/login", function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
      res.render("login", {
        errorMessage: "Wrong email/password"
      });
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/");
      });
    }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    Invitation.find({owner : req.user._id}, function(err,foundInvitation){
      if(err){
        console.log(err);
      }else{
        Group.find({ $or : [{admin: (req.user.id)} , {member : (req.user._id)}]},function(error, foundGroup){
          if(error){
            console.log(error);
          }else{
            res.render("main", {user: req.user, foundInvitation : foundInvitation, foundGroup : foundGroup});
          }
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.listen(port, function() {
  console.log("Server started successfully");
});
