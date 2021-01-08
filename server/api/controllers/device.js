'use strict';


var mongoose = require('mongoose'),
	Device = mongoose.model('Device');


exports.receive = function(req, res) {
	console.log(req.body)
	Device.update({token: req.body.token}, {token: req.body.token}, {upsert: true}, (err, result) => {
		console.log(result)
	})
};
