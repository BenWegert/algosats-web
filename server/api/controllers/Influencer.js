'use strict';


var mongoose = require('mongoose'),
	Task = mongoose.model('Influencer');

exports.list = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.create = function(req, res) {
	var new_task = new Task(req.body);
	new_task.save(function(err, task) {
		if (err)
			res.send(err);
		res.json(task);
	});
};

exports.read = function(req, res) {
	Task.findById(req.params.ID, function(err, task) {
		if (err)
			res.send(err);
		res.json(task);
	});
};


exports.update = function(req, res) {
	Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
		if (err)
	  		res.send(err);
		res.json(task);
	});
};


exports.delete = function(req, res) {
	Task.remove({
		_id: req.params.taskId
	}, function(err, task) {
		if (err)
	  		res.send(err);
		res.json({ message: 'Task successfully deleted' });
	});
};
