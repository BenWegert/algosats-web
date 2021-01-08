'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Trade = new Schema({
	symbol: {
		type: String
	},
	side: {
		type: String
	},
	price: {
		type: Number
	},
	timestamp: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Trade', Trade);