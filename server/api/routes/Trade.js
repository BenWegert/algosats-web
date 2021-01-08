'use strict';
module.exports = function(app) {
	var trade = require('../controllers/Trade');

	app.route('/trades')
		.get(trade.read)
};