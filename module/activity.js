var db = require('./db');
function Activity(activity) {
	this.id = activity.id;
	this.type = activity.type;
	this.date = activity.date;
	this.startTime = activity.startTime;
	this.endTime = activity.endTime;
	this.content = activity.content;
	this.address = activity.address;
	this.maxUsers = activity.maxUsers;
	this.minUsers = activity.minUsers;
	this.amount = activity.amount;
	this.auditMethod = activity.auditMethod;
	this.status = activity.status;
}

module.exports = Activity;

Activity.prototype.Save = function Save(callback) {
	var activity = {
		id: this.id,
		type: this.type,
		date: this.date,
		startTime: this.startTime,
		endTime: this.endTime,
		content: this.content,
		address: this.address,
		maxUsers: this.maxUsers,
		minUsers: this.minUsers,
		amount: this.amount,
		auditMethod: this.auditMethod,
		status: this.status
	};
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.insert(activity, {safe: true}, function(err,activity) {
				db.close();
				callback(err, activity);
			});
		});
		
	});
}

Activity.getAll = function getAll(callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.find().toArray(function(err, docs) {
					callback(err, docs);
					console.log(docs);
				});
			} else {
				callback(err, null);
			}
		});
	});
}