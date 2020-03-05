'use strict';

const Promise = require('bluebird');
const feedbackDataModel = require('../mongoDB/models/feedbackData');

// утилиты для управления данными об отправке писем через форму обратной связи
const feedbackUtils = new function() {

	// сброс данных об отправке писем не за сегодня - для данного устройства
    this.resetOldFeedbackData = function(fingerprint) {
        return feedbackDataModel.query({fingerprint: fingerprint})
			.then(results => {
				const tasks = [];

				if (results && results.length) {
					const currentDate = new Date();
					const currentDay = currentDate.getDate();
					const currentMonth = currentDate.getMonth();

					const oldResults = results.filter(item => item.date.getDate() !== currentDay &&
																item.date.getMonth() !== currentMonth);   //?

					if (oldResults.length) {
						oldResults.forEach(item => {
							tasks.push(feedbackDataModel.delete(item.id));
						})
					}
				}
				
				return Promise.all(tasks);
			})
    }
}

module.exports = feedbackUtils;