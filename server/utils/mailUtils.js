'use strict';

const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const config = require('../config');

// утилиты для отправки почты
const mailUtils = new function() {

	// отправка письма через форму обратной связи
	/*data = {
		name,
		email,
		text,
	}*/
	this.sendFeedbackLetter = function(data) {
		const transport = nodemailer.createTransport({
			service: config.mail_settings.service, 
			auth: { 
				user: config.mail_settings.auth.user 
				, pass: config.mail_settings.auth.pass
			}
		});

		// собственно письмо
		const letterHtml = require('../templates/feedbackLetter').get(data);

		const senderName = `${data.name} <${data.email}>`;

		// отправляем
		return transport.sendMail({
			from: senderName,
			to: config.mail_settings.email,
			subject: config.mail_settings.feedbackSubject,
			html: letterHtml
		})
            .then((result) => {
                transport.close();
                return result;
            });
	};
};

module.exports = mailUtils;