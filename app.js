//jshint esversion:6
require('dotenv').config()
console.log(process.env)
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const port = 3000;
const encrypt = require("mongoose-encryption");

const app = express();


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');

  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

console.log(process.env.SECRET);


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});


app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  })
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    }
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    }
  });
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
