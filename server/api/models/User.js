'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	token: {
		type: String,
		required: true
	},
	tname: [String],
	hash: String,
	keys: {
		type: Map,
    	of: {
    		key: {
				type: String
			},
			secret: {
				type: String
			},
			status: {
				type: String
			}
    	}
	},
	transactions: [{
		index: {
			type: Number,
			required: true
		},
		address: {
			type: String,
			required: true
		},
		received: {
			type: mongoose.Decimal128,
			default: 0.0000000
		},
		timestamp: {
			type: Date,
			default: Date.now
		}
	}],
	Created_date: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('User', User);