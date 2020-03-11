'use strict';

const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const feedbackDataSchema = require('../schemas/feedbackData');

// модель для работы с данными об отправке писем через форму обратной связи
const FeedbackDataModel = mongoose.model('FeedbackData', feedbackDataSchema);

module.exports = {

	query: function(config) {
		if (config) {
			if (config.fingerprint && config.getCount) {
				// получить кол-во отправленных писем
				return FeedbackDataModel.count(
					{ 'fingerprint': config.fingerprint}		
				);
			}
			else if (config.fingerprint) {
				return FeedbackDataModel.aggregate([
					{$match: { 'fingerprint': config.fingerprint}},
					{$project: {
						_id: 0, id: "$_id",
						fingerprint: 1,
						date: 1,
					}}
				]);
			}
		}	

		return [];
	},
	
	create: function(data) {
		const feedbackData = new FeedbackDataModel({
			fingerprint: data.fingerprint,
			date: new Date(),
		});
	
		return feedbackData.save();
	},

	// update: function(id, data) {
	// },
	
	delete: function(id) {
		return FeedbackDataModel.findOneAndRemove({_id: id});
	},
}