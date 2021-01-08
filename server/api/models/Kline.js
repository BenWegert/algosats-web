'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Kline = new Schema({
	symbol: {
		type: String
	},
	interval: {
		type: String
	},
	closeTime: {
		type: Number
	},
	kline: {
			type: [Number,Number,Number,Number,Number,Number,Number,Number,Number]
	}
});

module.exports = mongoose.model('Kline', Kline);