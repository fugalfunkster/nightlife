/* jslint node: true */

'use strict';

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var Rsvp = new Schema({
  barId: String,
  count: {type: Number, default: 1},
  userIds: {type: Array, default: []}
});

module.exports = mongoose.model('Rsvp', Rsvp);
