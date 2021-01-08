'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
	id: {
		type: Number,
	},
	screen_name: {
		type: String,
	},
	name: {
		type: String,
	},
	location: {
		type: String,
	},
	url: {
		type: String,
	},
	description: {
		type: String,
	},
	verified: {
		type: String,
	},
	followers_count: {
		type: Number,
	},
	friends_count: {
		type: Number,
	},
	favourites_count: {
		type: Number,
	},
	statuses_count: {
		type: Number,
	},
	created_at: {
		type: String,
	},
	Created_date: {
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model('Influencer', TaskSchema);