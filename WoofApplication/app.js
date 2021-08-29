const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const findOrCreate = require("mongoose-findorcreate");
const _ = require("lodash");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "WoofApplication.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-Sabrian:Sabrianjs1302@cluster0.p9zmt.mongodb.net/woof", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

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
  res.render("register");
});

app.post("/register", function(req, res) {

  console.log(req.body.username);

  if(req.body.userType === "Dog Owner"){
    User.register(new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      suburb : req.body.suburb,
      type: req.body.userType
    }), req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function() {
          var dog = new Dog({
            name: req.body.dogsName,
            breed: req.body.dogsBreed,
            size: req.body.dogsSize,
            weight: req.body.dogsWeight,
            dob: req.body.dogsDateOfBirth,
            owner: req.user._id
          });
          dog.save(function(err,result){
            if(err){
              console.log(err);
            }else{
              res.redirect("/");
            }
          });
        })
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
      type: req.body.userType
    }), req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
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
        res.render("updateProfile",{user : req.user, dogs : dogs, success : null, dogsDOB : formatDate(dogs[0].dob)});
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
             res.render("dogOwner", {user: req.user, foundUser : foundUser, dog : dog, age: calculate_age(dog[0].dob) });
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
      Dog.findOneAndUpdate({owner : req.user._id}, {
          name: req.body.dogsName,
          breed: req.body.dogsBreed,
          size: req.body.dogsSize,
          weight: req.body.dogsWeight,
          dob: req.body.dogsDateOfBirth
      }, function(err, docs) {
        if (err) {
          console.log(err);
          res.render("updateProfile",{user : req.user, dogs : dogs, success : false});
        }else{
          console.log(req.body.dogsDateOfBirth);
          Dog.find({owner : req.user._id}, function(err,dogs){
            res.render("updateProfile",{user : req.user, dogs : dogs, success : true, dogsDOB : formatDate(dogs[0].dob)});
          });
        }
      });
    }else{
        res.render("updateProfile",{user : req.user, success : true});
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
    res.redirect("login");
  }
});

app.listen(port, function() {
  console.log("Server started successfully");
});
