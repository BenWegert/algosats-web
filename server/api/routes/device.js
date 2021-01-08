'use strict';
module.exports = function(app) {
	var device = require('../controllers/device');

	app.route('/token')
		.post(device.receive)
};