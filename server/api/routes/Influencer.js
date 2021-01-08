'use strict';
module.exports = function(app) {
	var controller = require('../controllers/Influencer');

	app.route('/influencers')
    	.get(controller.list)
    	.post(controller.create);

	app.route('/influencers/:ID')
		.get(controller.read)
		.put(controller.update)
		.delete(controller.delete);
};