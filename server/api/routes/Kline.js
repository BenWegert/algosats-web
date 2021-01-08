'use strict';
module.exports = function(app) {
	var kline = require('../controllers/Kline');

	app.route('/kline/:symbol/:interval')
		.get(kline.call)
	app.route('/kline/:symbol/:interval/:start/:end')
		.get(kline.read)
};