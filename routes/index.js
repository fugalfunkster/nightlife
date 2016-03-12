/* jslint node: true */
'use strict';

var Yelp = require('yelp');
var path = process.cwd();
var Rsvp = require('../models/rsvps');

module.exports = function(app, passport) {

  var yelp = new Yelp({
    consumer_key: process.env.YELP_CONSUMER_KEY,
    consumer_secret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.send({redirect: '/login'});
    }
  }

  app.route('/')
    .get(function(req, res) {
      console.log(req.session.location);
      res.render('index.ejs', {user: req.user,
                               sessionLocation: req.session.location});
    });

  app.route('/login')
    .get(function(req, res) {
      res.render('login.ejs', {message: req.flash('loginMessage')});
    })
    .post(passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }));

  app.route('/signup')
    .get(function(req, res) {
      res.render('signup.ejs', {message: req.flash('signupMessage')});
    })
    .post(passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
    }));

  app.route('/oauth/github')
    .get(passport.authenticate('github'));

  app.route('/oauth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  app.route('/logout')
    .get(function(req, res) {
      req.logout();
      res.redirect('/login');
    });

  app.route('/location/:location')
    .post(function(req, res) {
      var location = req.params.location;
      req.session.location = location;
      // console.log(location);
      yelp.search({term: 'bars', location: location, limit: 10},
                  function(err, bars) {
        if (err) {
          return console.log(error);
        }

        Rsvp.find({count: {$gt : 0}}, function(err, savedBars) {
          if(err) {
            console.log(err);
          }
          var barsWithRsvps = bars.businesses.map(function(bar) {
            // console.log(bar);
            savedBars.map(function(savedBar) {
              if (bar.id === savedBar.barId) {
                bar.rsvp = savedBar.count;
                if (req.user) {
                  var listOfUsers = savedBar.userIds;
                  listOfUsers.forEach(function(user) {
                    if (user == req.user.id) {
                      bar.userRsvp = 'going';
                    }
                  });
                }
              }
            });
            return bar;
          });
          // console.log(barsWithRsvps);
          res.end(JSON.stringify(barsWithRsvps));
        });
      });
    });

  app.route('/rsvp/:id')
    .post(isLoggedIn, function(req, res) {
      var barId = req.params.id;
      var userId = req.user.id;
      var rsvp = {};
      Rsvp.findOneAndUpdate({barId : barId},
                            {$inc: {count: 1}, $push: {userIds: userId}},
                            {upsert: true, 'new': true, setDefaultsOnInsert: true},
                            function(err, doc) {
        if (err) {
          return console.log(error);
        }
        res.end(JSON.stringify(doc));
      });
    });

};
