'use strict';

/***********************************
 **** node module defined here *****
 ***********************************/
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backEnd', '.env') });
const EXPRESS = require('express');

const { SERVER } = require('./config');
const { xDownloadOptions } = require('helmet');

/** creating express server app for server */
const app = EXPRESS();

app.set('port', SERVER.PORT);
const server = require('http').Server(app);

/********************************
 ***** Server Configuration *****
 ********************************/
/** Server is running here */
const startNodeserver = async () => {
	await require('./app/startup/expressStartup')(app); // intialize middleware

	return new Promise((resolve, reject) => {
		server.listen(SERVER.PORT, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
};

startNodeserver()
	.then(() => {
		console.log('Socket server running on port', SERVER.PORT);
	})
	.catch((err) => {
		console.log('Error in starting server', err);
		process.exit(1);
	});

process.on('unhandledRejection', (error) => {
	// Will print "unhandledRejection err is not defined"
	console.log('unhandledRejection', error);
});
