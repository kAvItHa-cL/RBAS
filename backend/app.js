const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRouter = require('./routes/user')
const mailRouter = require('./routes/mailer')
const mongoose = require('mongoose')
const Roles = require('./models/roles')
const Config = require('./config/config.json')
mongoose.connect(Config.mongoDBURL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Mongoose")
    Roles.find().then(results => {
      console.log("Roles Count ",results.length)
      if (results.length <= 0) {
        var arr = [{ id: 1, name: "Admin" }, { id: 2, name: "User" }];
        Roles.insertMany(arr).then(() => { console.log("Roles Added") })
      }
  })
})
  .catch((err) => {
    console.log("Connection Failed : ",err);
  })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept ,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/user",userRouter);
app.use("/api/mailer",mailRouter);
module.exports = app;
