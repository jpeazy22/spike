// First, we'll need passport...
var passport = require('passport');

// We also need the strategy defined by our 'passport-local' module.
// Strategies are how passport abstracts the logic of working with
// different login systems like Facebook or Twitter. You can also
// use multiple strategies to support more auth types.

var SamlStrategy = require('passport-saml').Strategy;

// Since we will be using the user model to control access and
// persistence, we'll use that as well.
var User = require('../models/user');


// SERIALIZATION:
//  This small subset of code will take a user object, used
//  in our JS, and convert it into a small, unique, string
//  which is represented by the id, and store it into the
//  session.
passport.serializeUser(function(user, done){
  done(null, user.id);
});

// DESERIALIZATION:
//  Essentially the inverse of above. This will take a user
//  id out of the session and convert it into an actual
//  user object.
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
    console.log(user)
  });
});


// Here we define the strategy for our local authentication.
// This will be utilized by passport whenever we reference it.
var samlStrategy = new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
    issuer: 'passport-saml'
  },
  function(profile, done) {
    findByEmail(profile.email, function(err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  });

// Passport needs to know about our strategy definition above, so
// we hook that in here.
passport.use(samlStrategy);


// We don't really need to export anything from this file, since just
// including it is enough. However, this helpful middleware allows us
// to block access to routes if the user isn't authenticated by redirecting
// them to the login page. We'll see this used in app.js
module.exports = {
  ensureAuthenticated: function(req, res, next){

    // If the current user is logged in...
    if(req.isAuthenticated()){

      // Middleware allows the execution chain to continue.
      return next();
    }

    // If not, redirect to login
    res.redirect('/auth/login');
  }
};