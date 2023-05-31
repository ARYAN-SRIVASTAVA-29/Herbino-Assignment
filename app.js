require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');






const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));


app.use(session({
  secret: "Our Little Secret",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://0.0.0.0:27017/herbinoDB",{useNewUrlParser: true});



const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
    googleId: String,
    secret: String
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);



const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done){
    done(null, user.id);
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});





passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets"
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id })
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err, null);
      });
  }
));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] })
);

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/signup' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/login');
  });

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html")
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
