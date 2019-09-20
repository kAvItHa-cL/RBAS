const express = require('express');
var nodemailer = require('nodemailer');
const router = express.Router();
const crypto = require('crypto')
const ResetPassword = require('../models/resetPassword');
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.post('/resetlink', (req, res, next) => {
  const email = req.body.email
  User.findOne({ email: email }).then((user) => {
    //console.log("User", user)
    if (!user) {
      return res.status(404).json({
        message: 'No user found with that email address '
      });
    }

    ResetPassword
      .findOne({
        where: { userId: user._id, status: 0 },
      }).then(function (resetPassword) {
        if (resetPassword)
          resetPassword.destroy({
            where: {
              id: resetPassword.id
            }
          })

        token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password form (react)
        //console.log("Token : ", token)
        bcrypt.hash(token, null, function (err, hash) {//hashing the password to store in the db node.js
          ResetPassword.create({
            userId: user._id,
            token: token,
            expire: Date.now() + 360000, //3600000 1 hr
          }).then(function (item) {
            if (!item)
              return res.status(500).json({ message: 'Oops problem in creating new password record' })

            var transporter = nodemailer.createTransport({
              // host: this.host,
              // port: this.smtpPort,
              // secure: false, // true for 465, false for other ports,
              // tls: {
              //   rejectUnauthorized: false
              // },
              service: 'gmail',
              auth: {
                user: 'kavitha.vcnr@gmail.com',
                pass: 'vcnr1234'
              }
            });

            const mailOptions = {
              from: 'noreply@vcnr.com', // sender address
              to: req.body.email, // list of receivers
              subject: 'Password Reset Link', // Subject line
              html: '<h4><b>Reset Password</b></h4>' +
                '<p>To reset your password, complete this form:</p>' +
                '<a href=' + 'http://localhost:4200/resetpassword?userid=' + user._id + '&token=' + token + '>' + 'ResetLink </a> ' +
                '<br><br>' +
                '<p>--Team</p>'
            };


            transporter.sendMail(mailOptions, function (err, info) {
              if (err)
                console.log(err)
              else
                console.log(info);
            });


          });
        });
      });
  });
});

// router.get('/reset/:token', function (req, res) {
//   console.log("Inside Reset Token")
//   User.findOne({ resetPasswordToken: req.params.token, expire: Date.now() }, function (err, user) {
//     if (!user) {
//       req.flash('error', 'Password reset token is invalid or has expired.');
//       return res.redirect('/forgot');
//     }
//     res.render('reset', { token: req.params.token });
//     res.send().json({message :"something happend"})
//   });
// });

router.post('/verifytoken', (req, res, next) => {
  console.log("Hi");
  console.log(req.body.userid)
  ResetPassword.findOne({ userId: req.body.userid, token: req.body.token }).then(
    data => {
      if (!data || data.expire < Date.now()) {
        if (data) data.remove();
        res.json({ code: 500, message: "Session Expired" })

      }
    })
})

router.post('/updatepassword', (req, res, next) => {
  // console.log("Request ", req.body.param.userid)
  ResetPassword.findOne({ userId: req.body.param.userid, token: req.body.param.token })
    .then(result => {
      console.log(result);
      console.log(Date.now())
      if (!result || result.expire < Date.now()) {
        console.log("Expired")
      }
      else {
        bcrypt.hash(req.body.password, 10).then(hash => {
          password = hash

          console.log("Not Expired")
          User.findOneAndUpdate({ _id: req.body.param.userid }, { password: password }).then(user => {
            // user.password = req.body.password;
            console.log("user", user)
          })
        })
      }
    })
  res.send({ message: "success" });
})

module.exports = router;
