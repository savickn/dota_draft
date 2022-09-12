'use strict';

import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/User/user.model';
const validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Sets 'req.user' if authenticated, else returns 403
 */
export function isAuthenticated() {
  return compose()
    .use(function(req, res, next) { // used to validate jwt of user session, requires that the 'authorization' header be set to 'Bearer ${token}'
      if(req.query && req.query.hasOwnProperty('access_token')) { // allows 'access_token' to be passed through 'req.query' if necessary
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      //console.log('req.headers --> ', req.headers);
      validateJwt(req, res, next);
    })
    .use(function(req, res, next) { //used to attach 'user' to 'req'
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');

        req.user = user;
        console.log('user auth success');
        next();
      });
    });
}

/*
** used to check if currentUser is the author of the accessed material
*/
export function correctUser(className) {
  if (!className) throw new Error('Class name needs to be set');
  var objUser = '';

  className.findById(req.params.id, function(err, obj) {
    if (err) return next(err);
    if (!obj.user) return res.status(401).send('Unauthorized');

    objUser = obj.user;
  })

  return compose()
    .use(function checkUser(req, res, next) {
      if (req.user === objUser) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: '5h' });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

/*
** used to verify that user correctly entered their existing password, WORKING
*/
export function verifyOldPassword() {
  return compose()
    .use(function(req, res, next) {
      console.log('verifying password');
      if(req.user.authenticate(req.body.oldPassword)) {
        console.log('password verified');
        next();
      } else {
        let err = new Error("Your current password is incorrect!");
        return res.status(403).send(err);
      }
    });
}

/*
** used to verify activationToken, WORKING
*/
export function verifyActivationRequest() {
  return compose()
    .use(function(req, res, next) {
      let activationToken = req.session.activation;
      jwt.verify(req.query.activationToken, config.secrets.session, {maxAge: '1 day'}, function(err, token) {
        if(err) return res.status(403).send('This link has expired!');
        if(token.key !== activationToken.key || token.id !== activationToken.id) return res.status(401).send('Unauthorized');
        next();
      });
    });
}

/*
** used to verify resetToken, WORKING
*/
export function verifyResetRequest() {
  return compose()
    .use(function(req, res, next) {
      let resetToken = req.session.reset; //fix session not always defined
      jwt.verify(req.body.resetToken, config.secrets.session, {maxAge: '1 day'}, function(err, token) {
        if(err) return res.status(403).send('This link has expired!');
        if(token.key !== resetToken.key || token.id !== resetToken.id) return res.status(401).send('Unauthorized');
        next();
      });
    });
}
