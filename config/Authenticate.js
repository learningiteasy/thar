const localStrategy = require('passport-local').Strategy;
const User          = require('../model/User');
const config        = require('../config/db.config.js');
const bcrypt        = require('bcrypt');


const Passport = function(passport){
    //Local Strategy
    passport.use(new localStrategy({ passReqToCallback: true }, function(req, username, password, done){

        User.findByEmail(username, function(user, err){
            if(err) console.log(err);
            if(!user){
               return done(null, false, req.flash('errors', 'This ssdsds'));
            }

            //Match Password
            bcrypt.compare(password, user.password, function(err, isMatch){
              if(err) throw err;
              if(isMatch){

                //console.log(user);
                return done(null, user);

              } else {
                
                return done(null, false, { message: 'Incorrect password.' });
              }
            })
        });

    }));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });


}

module.exports = Passport;
