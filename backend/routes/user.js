const express = require('express');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const userRoles = require('../models/userRoles')
const Roles = require('../models/roles')

router.post('/signup', (req, res, next) => {
  // User.findOne({email : req.body.email}).then(userexists =>{
  //   console.log("Exists",userexists)
  //  return res.status(502).json({
  //     message : ' user Exists'
  //   });
  // })
  // .catch(ex => {
  //     return res.status(500).json({
  //       message: "Ex in finding user",
  //       error: ex
  //     })
  //   });
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    })

    console.log("Role", req.body.role)
    user.save().then(result => {
      req.body.role.forEach(element => {
        console.log("element", element);
        let userroles = new userRoles({
          userId: result._id,
          // roleId : 1,
          roleId: element
        });
        console.log("userroles", userroles);
        userroles.save().then({}).catch(err => {
          user.remove()
          res.status(500).json({
            message: ' couldnt create user due to roles issue'
          })
        })
      })
      //.then(rest => {
      res.status(200).json({
        message: 'User Created',
        result: result,
        useId: result._id
      })
      //});
    })
      .catch(err => {
        res.status(404).json({
          message: 'Invalid Authentication Credentials',
          error: err
        })
      })
  })

})


router.post('/login', (req, res, next) => {
  let fetchedUser;
  let roles = [];
  rolesnew=[];
  let roleId;
  let rolesofuser = []
  console.log(req.body.email)
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log("user in login backend", user);
      if (!user) {
        return res.status(404).json({
          message: 'User Not Exists',
        })
      }
      fetchedUser = user;
      let pwd = bcrypt.compare(req.body.password, user.password);
      console.log(pwd);
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      console.log(result);
      if (!result) {
        return res.status(401).json({
          message: 'Wrong Password..Authentication Failed '
        });
      }
      console.log(fetchedUser._id);
        userRoles.find({ userId: fetchedUser._id }).then(data => {
        data.forEach(element => {
          console.log(element)
          roleId = element.roleId;
          console.log("Role Id ", roleId)
          Roles.findOne({ id: roleId }).then(userrole => {
            roles.push(userrole.name)
            console.log("Roles sfsdfdsf", roles);
          // })
          console.log("Roles of User", roles)
        //})
        console.log("roleIds",roles)
      if(roles.length === data.length){


        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          'secret_this_should_be_longer',
          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: '',
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          roles: roles
        })
      }
      })
        })
      })
    })
    .catch(err => {
      return res.status(500).json({
        message: 'Authentication  Failed'
      })
    })
})
module.exports = router;
