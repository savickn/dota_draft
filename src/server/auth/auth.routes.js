'use strict';

import express from 'express';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import User from '../api/User/user.model';
import { signToken } from './auth.service';

passport.use('local-auth', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, false, { email: 'This email is not registered.' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { password: 'This password is not correct.' });
      }
      return done(null, user);
    });
  }
));

var router = express.Router();

router.post('/local/', function(req, res, next) {
  passport.authenticate('local-auth', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

    var token = signToken(user._id, user.role);
    console.log('login success');
    res.status(200).json({ token });
  })(req, res, next)
});

export default router;
