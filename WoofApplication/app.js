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
  weight: Number,
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
  preference: [String],
  distance: Number,
  password: String
});

const activitySchema = new mongoose.Schema({
  location: String,
  dateTime : Date,
  name: String,
  description: String,
  member: [String],
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
  member : [String],
  creator : String
});

const trainingSchema = new mongoose.Schema({
  location : String,
  dateTime : Date,
  name : String,
  description : String,
  member: [String],
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

app.get("/changePicture", function(req,res){
  if(req.isAuthenticated()){
    Invitation.find({owner : req.user.id}, function(err, foundInvitation){
      if(err){
        console.log(err);
      }else{
        res.render("changePicture", {user: req.user,foundInvitation : foundInvitation});
      }
    });
  }else{
    res.redirect("login");
  }
});

app.post("/changePicture", function(req,res){
  var image = req.body.imageURI;
  if(req.isAuthenticated()){
    if(image != null){

      var uploadedResponse = cloudinary.uploader.upload(image,{
        upload_preset: 'profilesImage',
        public_id : req.user._id,
        q_auto : "eco"
      }, function(error,result){
        console.log(error,result);
      });


    }

    res.redirect("/");
  }else{
    res.redirect("login");
  }
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
              Group.find({ $or : [{admin: (req.user.id)} , {member : (req.user._id)}]},function(error, foundGroup){
                if(error){
                  console.log(error);
                }else{
                  res.render("createActivity", {user: req.user, foundInvitation : foundInvitation, foundGroup : foundGroup, dogOwners : dogOwners});
                }
              });
            }
          });
        }
      }
    );
  } else {
    res.redirect("login");
  }
});

app.post("/createActivity", function(req,res){
  var activity = new Activity({
    location : req.body.address,
    dateTime : req.body.dateTime,
    name : req.body.name,
    description : req.body.description,
    member : [],
    creator : req.user._id
  });

  activity.save(function(err,result){
    if(err){
      console.log(err);
    }
  });

  var owners = req.body.owners;

if(owners != null){
  for(var i=0; i < owners.length ; i++){
    var invitation = new Invitation({
      name : req.body.name,
      type : "activity",
      targetID : activity._id,
      owner : owners[i],
      message : req.body.name + " at " + req.body.address
    });

    invitation.save(function(err,result){
      if(err){
        console.log(err);
      }
    });
  }
}
  var groups = req.body.groups;

if(groups != null){
  for(var i=0 ; i < groups.length ; i++){
    Group.find({_id : groups[i]}, function(err, foundGroup){
      if(err){
        console.log(err);
      }else{
        for(var j=0 ; j < foundGroup[0].member.length ; j++){
          var query = {
            name : req.body.name,
            type : "activity",
            targetID : activity._id,
            owner : foundGroup[0].member[j],
            message : req.body.name + " at " + req.body.address
          };

          var update = { expire: new Date() };
          var options = { upsert: true, new: true, setDefaultsOnInsert: true };

          Invitation.findOneAndUpdate(query, update, options, function(error,result){
              if(error){
                console.log(error);
              }
            });
        }

        if(foundGroup[0].admin != req.user._id){
          var query = {
            name : req.body.name,
            type : "activity",
            targetID : activity._id,
            owner : foundGroup[0].admin,
            message : req.body.name + " at " + req.body.address
          };

          var update = { expire: new Date() };
          var options = { upsert: true, new: true, setDefaultsOnInsert: true };

          Invitation.findOneAndUpdate(query, update, options, function(error,result){
              if(error){
                console.log(error);
              }
            });
        }
      }
    });
  }
}
  res.redirect("/");
});

app.get("/activities/:activityID",function(req,res){
  if(req.isAuthenticated()){
    var activityID = req.params.activityID;

    Activity.find({_id : activityID}, function(err,foundActivity){
      if(err){
        console.log(err);
      }else{
        const activity = foundActivity[0];

        User.find({_id : activity.creator}, function(err,creator){
          if(err){
            console.log(err);
          }else{
            User.find({type : "Dog Owner"}, function(err,foundUser){
              if(err){
                console.log(err);
              }else{
                var isMember = false;
                var member = [];
                for(var i=0 ; i < activity.member.length ; i++){
                  for(var j=0 ; j < foundUser.length ; j++){
                    if(activity.member[i] == foundUser[j]._id){
                      console.log(foundUser[j].username);
                      member.push(foundUser[j].username);
                    }

                    if(activity.member[i] == req.user._id || activity.creator == req.user_id){
                      isMember = true;
                    }
                  }
                }

                Invitation.find({owner : req.user._id}, function(err, foundInvitation){
                  if(err){
                    console.log(err);
                  }else{
                    res.render("viewActivity", {user : req.user, foundInvitation : foundInvitation, creator : creator[0].username, member : member, foundActivity : foundActivity, isMember : isMember })
                  }
                });
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

app.get("/createEvent", function(req, res) {
  if (req.isAuthenticated()) {
    User.find({type : "Trainer"}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
          var trainers = [];
          for(var i=0; i < foundUser.length ; i++){
            if(req.user.username === foundUser[i].username){
              continue;
            }else{
              trainers.push(foundUser[i]);
            }
          }

          Invitation.find({owner : req.user._id}, function(err,foundInvitation){
            if(err){
              console.log(err);
            }else{
              res.render("createEvent",{user : req.user, trainers : trainers, foundInvitation : foundInvitation});
            }
          });
        }
      }
    );
  } else {
    res.redirect("login");
  }
});

app.post("/createEvent", function(req,res){
  var event = new Event({
    location : req.body.address,
    dateTime : req.body.dateTime,
    name : req.body.name,
    description : req.body.description,
    member : [],
    creator : req.user._id
  });

  event.save(function(err,result){
    if(err){
      console.log(err);
    }
  });

  var trainers = req.body.trainers;

  if(trainers != null){
    for(var i=0 ; i < trainers.length ; i++){
      var invitation = new Invitation({
        name : req.body.name,
        type : "event",
        targetID : event._id,
        owner : trainers[i],
        message : req.body.name + " at " + req.body.address
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

app.get("/events/edit/:eventID", function(req,res){
  const eventID = req.params.eventID;
  if(req.isAuthenticated()){
    User.find({type : "Trainer"}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        var trainers = [];
        for(var i=0 ; i < foundUser.length ; i++){
          if(req.user.username == foundUser[i].username){
            continue;
          }else{
            trainers.push(foundUser[i]);
          }
        }

        Invitation.find({owner : req.user._id}, function(err, foundInvitation){
          if(err){
            console.log(err);
          }else{
            Event.find({_id : eventID}, function(err, foundEvent){
              if(err){
                console.log(err);
              }else{
                res.render("editEvent", {user : req.user, trainers : trainers, foundInvitation : foundInvitation, foundEvent : foundEvent});
              }
            });
          }
        });
      }
    })
  }else{
    res.redirect("/");
  }
});

app.post("/events/edit/:eventID", function(req,res){
  const eventID = req.params.eventID;
  const currentTrainersExclude = req.body.currentTrainersExclude;
  if(req.isAuthenticated()){
    if(currentTrainersExclude != null){
      for(var i=0 ; i < currentTrainersExclude.length ; i++){
        Event.findByIdAndUpdate(eventID, {$pull : { member : currentTrainersExclude[i]}}, function(error,result){
          if(error){
            console.log(error);
          }
        });
      }
    }

    Event.findByIdAndUpdate(eventID, {
      location : req.body.address,
      dateTime : req.body.dateTime,
      name : req.body.name,
      description : req.body.description
    }, function(error,result){
      if(error){
        console.log(error);
      }
    });

    var newTrainers = req.body.newTrainers;

    if(newTrainers != null){
      for(var i=0 ; i < newTrainers.length ; i++){
        var invitation = new Invitation({
          name : req.body.name,
          type : "event",
          targetID : eventID,
          owner : newTrainers[i],
          message : req.body.name + " at " + req.body.address
        });

        invitation.save(function(err,result){
          if(err){
            console.log(err);
          }
        });
      }
    }

    res.redirect("/");
  }else{
    res.redirect("login");
  }
});

app.get("/events/:eventID", function(req,res){
  if(req.isAuthenticated()){
    var eventID = req.params.eventID;

    Event.find({_id : eventID}, function(err, foundEvent){
      if(err){
        console.log(err);
      }else{
        const event = foundEvent[0];

        User.find({_id : event.creator}, function(err, creator){
          if(err){
            console.log(err);
          }else{
            User.find({type : "Trainer"}, function(err,foundUser){
              if(err){
                console.log(err);
              }else{
                var member = [];
                for(var i=0 ; i < event.member.length ; i++){
                  for(var j=0 ; j < foundUser.length ; j++){
                    if(event.member[i] == foundUser[j]._id){
                      member.push(foundUser[j].username);
                    }
                  }
                }

                Invitation.find({owner : req.user._id}, function(err, foundInvitation){
                  if(err){
                    console.log(err);
                  }else{
                    res.render("viewEvent", {user : req.user, foundInvitation : foundInvitation, creator : creator[0].username, member : member, foundEvent : foundEvent });
                  }
                });
              }
            });
          }
        });
      }
    });
  }else{
    res.redirect("/");
  }
});

app.get("/createTraining", function(req, res) {
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
              res.render("createTraining",{user : req.user, dogOwners : dogOwners, foundInvitation : foundInvitation});
            }
          });
        }
      }
    );
  } else {
    res.redirect("login");
  }
});

app.post("/createTraining", function(req,res){
  var training = new Training({
    location : req.body.address,
    dateTime : req.body.dateTime,
    name : req.body.name,
    description : req.body.description,
    member : [],
    creator : req.user._id
  });

  training.save(function(err,result){
    if(err){
      console.log(err);
    }
  });

  var owners = req.body.owners;

  if(owners != null){
    for(var i=0 ; i < owners.length ; i++){
      var invitation = new Invitation({
        name : req.body.name,
        type : "training",
        targetID : training._id,
        owner : owners[i],
        message : req.body.name + " at " + req.body.address
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

app.get("/trainings/:trainingID", function(req,res){
  if(req.isAuthenticated()){
    var trainingID = req.params.trainingID;

    Training.find({_id : trainingID}, function(err, foundTraining){
      if(err){
        console.log(err);
      }else{
        const training = foundTraining[0];

        User.find({_id : training.creator}, function(err, creator){
          if(err){
            console.log(err);
          }else{
            User.find({type : "Dog Owner"}, function(err,foundUser){
              if(err){
                console.log(err);
              }else{
                var isMember = false;
                var member = [];
                for(var i=0 ; i < training.member.length ; i++){
                  for(var j=0 ; j < foundUser.length ; j++){
                    if(training.member[i] == foundUser[j]._id){
                      member.push(foundUser[j].username);
                    }

                    if(training.member[i] == req.user._id){
                      isMember = true;
                    }
                  }
                }

                Invitation.find({owner : req.user._id}, function(err, foundInvitation){
                  if(err){
                    console.log(err);
                  }else{
                    res.render("viewTraining", {user : req.user, foundInvitation : foundInvitation, creator : creator[0].username, member : member, foundTraining : foundTraining, isMember : isMember });
                  }
                });
              }
            });
          }
        });
      }
    });
  }else{
    res.redirect("/");
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

app.get("/leave/activity/:activityID", function(req,res){
  if(req.isAuthenticated()){
    Activity.updateOne({_id : req.params.activityID}, {$pull : {member : req.user._id}}, function(err,result){
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

app.get("/leave/training/:trainingID", function(req,res){
  if(req.isAuthenticated()){
    Training.updateOne({_id : req.params.trainingID}, {$pull : {member : req.user._id}}, function(err,result){
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

app.get("/leave/event/:eventID", function(req,res){
  if(req.isAuthenticated()){
    Event.updateOne({_id : req.params.eventID}, {$pull : {member : req.user._id}}, function(err,result){
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

if(owners != null){
  for(var i=0 ; i < owners.length ; i++){
    var invitation = new Invitation({
      name: req.body.name,
      type: "group",
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
}

res.redirect("/");
});

app.get("/groups/:groupID", function(req,res){
    if(req.isAuthenticated()){
      var groupID = req.params.groupID;

      Group.find({_id : groupID}, function(err,foundGroup){
        if(err){
          console.log(err);
        }else{
          const group = foundGroup[0];

          User.find({_id : group.admin}, function(err,admin){
            if(err){
              console.log(err);
            }else{
              User.find({type : "Dog Owner"}, function(err,foundUser){
                if(err){
                  console.log(err);
                }else{
                  var member = [];
                  for(var i=0 ; i < group.member.length ; i++){
                    for(var j=0 ; j < foundUser.length ; j++){
                      if(group.member[i] == foundUser[j]._id){
                        member.push(foundUser[j].username);
                      }
                    }
                  }

                  Invitation.find({owner : req.user._id}, function(err,foundInvitation){
                    if(err){
                      console.log(err);
                    }else{
                      res.render("viewGroup", {user : req.user, foundInvitation : foundInvitation, admin : admin[0].username, member : member, foundGroup : foundGroup});
                    }
                  });
                }
              });
            }
          })
        }
      });
    }else{
      res.redirect("login");
    }

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

app.get("/activities/edit/:activityID", function(req, res) {
  const activityID = req.params.activityID;
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
              Group.find({ $or : [{admin: (req.user.id)} , {member : (req.user._id)}]},function(error, foundGroup){
                if(error){
                  console.log(error);
                }else{
                  Activity.find({_id : activityID}, function(err, foundActivity){
                    if(err){
                      console.log(err);
                    }else{
                      res.render("editActivity",{user : req.user, dogOwners : dogOwners, foundInvitation : foundInvitation , foundGroup : foundGroup, foundActivity : foundActivity});
                    }
                  });
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

app.get("/trainings/edit/:trainingID", function(req,res){
  const trainingID = req.params.trainingID;
  if(req.isAuthenticated()){
    User.find({type : "Dog Owner"}, function(err,dogOwners){
      if(err){
        console.log(err);
      }else{
        Invitation.find({owner : req.user._id}, function(err,foundInvitation){
          if(err){
            console.log(err);
          }else{
            Training.find({_id : trainingID}, function(err, foundTraining){
              if(err){
                console.log(err);
              }else{
                res.render("editTraining",{user : req.user, dogOwners : dogOwners, foundInvitation : foundInvitation, foundTraining});
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

app.post("/trainings/edit/:trainingID",function(req,res){
  const trainingID = req.params.trainingID;
  const currentOwnersExclude = req.body.currentOwnersExclude;
if(req.isAuthenticated()){
  if(currentOwnersExclude != null){
    for(var i=0 ; i < currentOwnersExclude.length ; i++){
      Training.findByIdAndUpdate(trainingID, {$pull : {member : currentOwnersExclude[i]}}, function(error,result){
        if(error){
          console.log(error);
        }
      })
    }
  }

  Training.findByIdAndUpdate(trainingID, {
    location : req.body.address,
    dateTime : req.body.dateTime,
    name : req.body.name,
    description : req.body.description
  },function(error,result){
    if(error){
      console.log(error);
    }
  });

  var newOwners = req.body.newOwners;

  if(newOwners != null){
    for(var i=0 ; i < newOwners.length ; i++){
      var invitation = new Invitation({
        name : req.body.name,
        type : "training",
        targetID : trainingID,
        owner : newOwners[i],
        message : req.body.name + " at " + req.body.address
      });

      invitation.save(function(err,result){
        if(err){
          console.log(err);
        }
      });
    }
  }

  res.redirect("/");

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

app.post("/activities/edit/:activityID", function(req,res){
  const activityID = req.params.activityID;
  const currentOwnersExclude = req.body.currentOwnersExclude;

  if(currentOwnersExclude != null){
    for(var i=0 ; i < currentOwnersExclude.length ; i++){
      Activity.findByIdAndUpdate(activityID, {$pull : {member : currentOwnersExclude[i]}}, function(error,result){
        if(error){
          console.log(error);
        }
      });
    }
  }

  Activity.findByIdAndUpdate(activityID,{
    location : req.body.address,
    dateTime : req.body.dateTime,
    name : req.body.name,
    description : req.body.description
  }, function(error,result){
    if(error){
      console.log(error);
    }
  });

  var excludedGroup = req.body.excludedGroup;

  if(excludedGroup != null){
    for(var i=0 ; i < excludedGroup.length ; i++){
      Group.find({_id : excludedGroup[i]}, function(err,foundGroup){
        if(err){
          console.log(err);
        }else{
          var currentGroup = foundGroup[0];
          for(var j=0 ; j<currentGroup.member.length ; j++){
            Activity.findByIdAndUpdate(activityID, {$pull : {member : currentGroup.member[j]}}, function(error,result){
              if(error){
                console.log(error);
              }
            });
          }
        }
      });
    }
}

  var newOwners = req.body.newOwners;

  if(newOwners != null){
    for(var i=0 ; i < newOwners.length ; i++){
      var invitation = new Invitation({
        name : req.body.name,
        type : "activity",
        targetID : activityID,
        owner : newOwners[i],
        message : req.body.name + " at " + req.body.address
      });

      invitation.save(function(err,result){
        if(err){
          console.log(err);
        }
      });
    }
  }

  var invitedGroup = req.body.invitedGroup;

  if(invitedGroup != null){
    for(var i=0; i < invitedGroup.length ; i++){
      Group.find({_id : invitedGroup[i]}, function(err, foundGroup){
        if(err){
          console.log(err);
        }else{
          var currentGroup = foundGroup[0];
          for(var j=0 ; j < currentGroup.member.length ; j++){
            var query = {
              name : req.body.name,
              type : "activity",
              targetID : activityID,
              owner : currentGroup.member[j],
              message : req.body.name + " at " + req.body.address
            };
            var update = { expire: new Date() };
            var options = { upsert: true, new: true, setDefaultsOnInsert: true };

            Invitation.findOneAndUpdate(query, update, options, function(error,result){
              if(error){
                console.log(error);
              }
            });
          }
        }
      });
    }
  }

  res.redirect("/");
});


app.get("/join/group/:invitationID", function(req,res){
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

app.get("/join/training/:invitationID", function(req,res){
  const invitationID = req.params.invitationID;
  if(req.isAuthenticated()){
    Invitation.find({_id : invitationID}, function(err, foundInvitation){
      if(err){
        console.log(err);
      }else{
        const invitation = foundInvitation[0];

        Training.findByIdAndUpdate(invitation.targetID, {$push : {"member" : invitation.owner}},
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

app.get("/join/activity/:invitationID", function(req,res){
  const invitationID = req.params.invitationID;
  if(req.isAuthenticated()){
    Invitation.find({_id : invitationID}, function(err, foundInvitation){
      if(err){
        console.log(err);
      }else{
        const invitation = foundInvitation[0];

        Activity.findByIdAndUpdate(invitation.targetID,{$addToSet : {"member":invitation.owner}}, function(error,result){
          if(error){
            console.log(error);
          }else{
            Invitation.findByIdAndRemove(invitation._id, function(er,success){
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
    res.redirect("login");
  }
});

app.get("/join/event/:invitationID", function(req,res){
  const invitationID = req.params.invitationID;
  if(req.isAuthenticated()){
    Invitation.find({_id : invitationID}, function(err, foundInvitation){
      if(err){
        console.log(err);
      }else{
        const invitation = foundInvitation[0];

        Event.findByIdAndUpdate(invitation.targetID,{$addToSet : {"member":invitation.owner}}, function(error,result){
          if(error){
            console.log(error);
          }else{
            Invitation.findByIdAndRemove(invitation._id, function(er,success){
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
    res.redirect("login");
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
  }else{
    res.redirect("login");
  }
});

app.get("/delete/activity/:activityID", function(req,res){
  const activityID = req.params.activityID;
  if(req.isAuthenticated()){
    Activity.findByIdAndRemove(activityID, function(err,result){
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

app.get("/delete/training/:trainingID", function(req,res){
  const trainingID = req.params.trainingID;
  if(req.isAuthenticated()){
    Training.findByIdAndRemove(trainingID, function(err,result){
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

app.get("/delete/event/:eventID", function(req,res){
  const eventID = req.params.eventID;
  if(req.isAuthenticated()){
    Event.findByIdAndRemove(eventID, function(err,result){
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

    cloudinary.uploader.destroy('profilesImage/' + req.user._id, function(error,result) {
console.log(result, error) });

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

app.get("/activities", function(req, res) {

  if (req.isAuthenticated()) {
    Activity.find({$and : [{member : {$ne : req.user._id}} , {creator : {$ne : req.user._id}}]}, function(err,foundActivity){
      if(err){
        console.log(err);
      }else{
        Invitation.find({owner : req.user._id}, function(err,foundInvitation){
          if(err){
            console.log(err);
          }else{
            res.render("activities", {user: req.user, foundInvitation : foundInvitation, foundActivity : foundActivity});
          }
          });
        }
      }
    );
  } else {
    res.redirect("login");
  }
});

app.get("/trainings", function(req, res) {

  if (req.isAuthenticated()) {
    Training.find({$and : [{member : {$ne : req.user._id}} , {creator : {$ne : req.user._id}}]}, function(err,foundTraining){
      if(err){
        console.log(err);
      }else{
        Invitation.find({owner : req.user._id}, function(err,foundInvitation){
          if(err){
            console.log(err);
          }else{
            res.render("trainings", {user: req.user, foundInvitation : foundInvitation, foundTraining : foundTraining});
          }
          });
        }
      }
    );
  } else {
    res.redirect("login");
  }
});

app.get("/activities/join/:activityID", function(req,res){
  const activityID = req.params.activityID;
  if(req.isAuthenticated()){
    Activity.findByIdAndUpdate(activityID, {$push : {"member" : req.user._id}},
    {safe: true, upsert: true, new : true}, function(error,result){
      if(error){
        console.log(error);
      }else{
        res.redirect("/activities");
      }
    });
  }else{
    res.redirect("login");
  }
});

app.get("/trainings/join/:trainingID", function(req,res){
  const trainingID = req.params.trainingID;
  if(req.isAuthenticated()){
    Training.findByIdAndUpdate(trainingID, {$push : {"member" : req.user._id}},
    {safe: true, upsert: true, new : true}, function(error,result){
      if(error){
        console.log(error);
      }else{
        res.redirect("/trainings");
      }
    });
  }else{
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

          console.log(req.body.numberOfNewDogs);

          if(req.body.numberOfNewDogs != 0){
            var currentDogs = dogs.length;

            for(var i=0; i < req.body.numberOfNewDogs; i++){
              currentDogs++;

              var newName = 'req.body.newDogsName' + currentDogs;
              var newBreed = 'req.body.newDogsBreed' + currentDogs;
              var newSize = 'req.body.newDogsSize' + currentDogs;
              var newWeight = 'req.body.newDogsWeight' + currentDogs;
              var newDob = 'req.body.newDogsDateOfBirth' + currentDogs;

              var dog = new Dog({
              name: eval(newName),
              breed: eval(newBreed),
              size: eval(newSize),
              weight: eval(newWeight),
              dob: eval(newDob),
              owner: req.user._id
            });
            dog.save(function(err,result){
              if(err){
                console.log(err);
              }
            });

            var imageURIName = "req.body.imageURI" + currentDogs;
            var uploadedResponse = cloudinary.uploader.upload(eval(imageURIName),{
              upload_preset: 'dogsImage',
              public_id : dog._id
            });

            }
          }

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
      const user = req.user;

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
            Activity.find({$or : [{creator : (req.user._id)}, {member : (req.user._id)}]}, function(error,foundActivity){
              if(error){
                console.log(error);
              }else{
                Training.find({$or : [{creator : (req.user._id)}, {member : (req.user._id)}]}, function(error,foundTraining){
                  if(error){
                    console.log(error);
                  }else{
                    Event.find({$or : [{creator : (req.user._id)}, {member : (req.user._id)}]}, function(error,foundEvent){
                      if(error){
                        console.log(error);
                      }else{
                        res.render("main", {user: req.user, foundInvitation : foundInvitation, foundGroup : foundGroup, foundActivity : foundActivity, foundTraining : foundTraining, foundEvent : foundEvent});
                      }
                    });
                  }
                });
              }
            });

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
