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

usersSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", usersSchema);
const Dog = new mongoose.model("Dog", dogsSchema);

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

        res.render("updateProfile",{user : req.user, dogs : dogs, success : null, dogsDOB : dogsDOB});
      });
    }else{
      res.render("updateProfile",{user : req.user, success : null});
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
              res.render("dogOwners",{user : req.user, results : results});
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
        res.render("trainers", {user: req.user, results : results});
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
        res.render("trainer", {user: req.user, foundUser : foundUser});
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

             res.render("dogOwner", {user: req.user, foundUser : foundUser, dog : dog, dogAges: dogAges });
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
          res.render("updateProfile",{user : req.user, dogs : dogs, success : false});
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
    res.render("changePassword", {
      success: null, user: req.user
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
            res.render("changePassword", {
              success: false, user: req.user
            });
            console.log(err);
          } else {
            res.render("changePassword", {
              success: true, user: req.user
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
    res.render("main", {user : req.user});
  } else {
    res.redirect("/login");
  }
});

app.listen(port, function() {
  console.log("Server started successfully");
});
