'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// данные об отправке письма через форму обратной связи
const feedbackDataSchema = new Schema(
	{
		fingerprint: { type: String },   // данные устройства, с которого было отправлено письмо
		date: Date,                      // дата отправки
	},
	{versionKey: false}
);

module.exports = feedbackDataSchema;
