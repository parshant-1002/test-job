'use strict';

const MESSAGES = require('../utils/messages');
const commonFunctions = require('./../utils/utils');
const { createSuccessResponse } = require('../helpers');

/**************************************************
 ***************** Notification Controller ***************
 **************************************************/

const notificationController = {};

/**
 * Function to save notifications.
 * @param {*} payload
 * @returns
 */
notificationController.sendNotification = async (payload) => {
	await commonFunctions.sendFCMNotification(payload.deviceToken, 'notification', payload.message, payload.notificationId);
	return createSuccessResponse(MESSAGES.SUCCESS);
};

/* export notificationController */
module.exports = notificationController;
