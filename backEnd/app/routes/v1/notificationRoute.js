'use strict';

const Joi = require('joi');
const { notificationController } = require('../../controllers');

const routes = [
	{
		method: 'POST',
		path: '/v1/notification',
		joiSchemaForSwagger: {
			body: {
				deviceToken: Joi.string().required().description('Device token'),
				message: Joi.string().required().description('Notification message'),
				notificationId: Joi.string().required().description('Notification id')
			},
			description: 'Api to sene push notification'
		},
		handler: notificationController.sendNotification
	}
];

module.exports = routes;
