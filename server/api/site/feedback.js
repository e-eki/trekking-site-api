'use strict';

const express = require('express');
const Promise = require('bluebird');
const utils = require('../../utils/baseUtils');
const logUtils = require('../../utils/logUtils');
const mailUtils = require('../../utils/mailUtils');
const feedbackUtils = require('../../utils/feedbackUtils');
const errors = require('../../utils/errors');
const feedbackDataModel = require('../../mongoDB/models/feedbackData');
const config = require('../../config');

let router = express.Router();

//----- endpoint: /api/site/feedback/
router.route('/feedback')

	.get(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
	})

	// отправка письма через форму обратной связи
	/*data = {
		name,
		email,
		text,
		fingerprint
	}*/
  	.post(function(req, res) {
		const name = req.body.name;
		const email = req.body.email;
		const text = req.body.text;
		const fingerprint  = req.body.fingerprint;

		return Promise.resolve(true)
			.then(() => {	
				const validationErrors = [];

				//validate req.body
				if (!req.body.name || req.body.name == '') {
					validationErrors.push('empty name');
				}
				if (!req.body.email || req.body.email == '') {
					validationErrors.push('empty email');
				}
				if (!req.body.text || req.body.text == '') {
					validationErrors.push('empty text');
				}
				if (!req.body.fingerprint || req.body.fingerprint == '') {
					validationErrors.push('empty device data');
				}
				if (validationErrors.length !== 0) {
					throw utils.initError(errors.VALIDATION_ERROR, validationErrors);
				}

				// проверяем количество уже отправленных писем в этот день с этого устройства,
				// если их количество > макс.допустимого, то все последующие не обрабатывать
				return feedbackDataModel.query({fingerprint: fingerprint, getCount: true});
			})
			.then(feedbackDataCount => {
				if (feedbackDataCount > config.security.feedbackMaxCount) {
					throw utils.initError(errors.VALIDATION_ERROR, 'Количество отправленных через сайт писем за сегодня с данного устройства больше допустимого. Отправьте завтра. Или обратитесь к администратору сайта.');
				}

				// сброс данных об отправке писем не за сегодня - для данного устройства  // todo: где лучше делать??
				return feedbackUtils.resetOldFeedbackData(fingerprint);
			})
			.then(dbResponses => {
				logUtils.fileLogDbErrors(dbResponses);

				const feedbackData = {
					name: name,
					email: email,
					text: text
				};

				//отправляем письмо на имейл сайта
				return mailUtils.sendFeedbackLetter(feedbackData)
					.catch(error => {
						// возможная ошибка на этапе отправки письма
						throw utils.initError(errors.INTERNAL_SERVER_ERROR);	  //?				
					})
			})
			.then(result => {
				const feedbackData = {
					fingerprint: fingerprint,
				};

				// создаем в БД запись об отправке письма
				return feedbackDataModel.create(feedbackData);
			})
			.then(dbResponse => {
				logUtils.fileLogDbErrors(dbResponse);

				return utils.sendResponse(res, 'Ваше письмо было отправлено');
			})
			.catch((error) => {
				return utils.sendErrorResponse(res, error);
			});
	})

	.put(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
	})

	.delete(function(req, res) {
		return utils.sendErrorResponse(res, errors.UNSUPPORTED_METHOD);
	})
;

module.exports = router;

