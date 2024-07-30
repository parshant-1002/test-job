'use strict';

/***********************************
 ****** Configuration Manager ******
 ***********************************/
module.exports = {
	SERVER: {
		NODE_ENV: process.env.NODE_ENV || 'development',
		PROTOCOL: process.env.SERVER_PROTOCOL || 'http',
		HOST: process.env.SERVER_HOST || '0.0.0.0',
		PORT: process.env.SERVER_PORT || '3004',
		get URL() {
			return `${this.PROTOCOL}://${this.HOST}:${this.PORT}`;
		}
	},
	FCM: {
		API_KEY: process.env.FCM_API_KEY || 'test-fcm-token'
	}
};
