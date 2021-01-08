'use strict';


var mongoose = require('mongoose'),
	Kline = mongoose.model('Kline');


exports.read = function(req, res) {

	Kline
	.find({symbol: {$eq: req.params.symbol}, 
		closeTime: {$gt: req.params.start, $lt: req.params.end}, 
		interval: {$eq: req.params.interval}})
	.select({kline: true, _id: false})
	.sort({closeTime: -1})
	.limit(10000)
	.exec()
	.then(result => {
		var data = []
		var i = result.length-1;
		result.forEach(index => {
      		data[i] = (index.kline);
      		i--;
    	})
		res.jsonp(data)
	})
	.catch(err => {})

};


exports.call = function(req, res) {
	
	Kline
	.find({symbol: {$eq: req.params.symbol}, 
		interval: {$eq: req.params.interval}})
	.select({kline: true, _id: false})
	.sort({closeTime: -1})
	.limit(10000)
	.exec()
	.then(result => {
		var data = []
		var i = result.length-1;
		result.forEach(index => {
      		data[i] = (index.kline);
      		i--;
    	})
		res.jsonp(data)
	})
	.catch(err => {})
};
