'use strict';


var mongoose = require('mongoose'),
	Trade = mongoose.model('Trade');


exports.read = function(req, res) {

	Trade
	.find({})
	.limit(10000)
	.exec()
	.then(result => {
		res.json(result)
	})
	.catch(err => {})
};
