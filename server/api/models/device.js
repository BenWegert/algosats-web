'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Device = new Schema({
	token: {
		type: String,
		required: true
	},
	Created_date: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Device', Device);