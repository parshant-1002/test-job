"use strict";

// const fcm = require("firebase-admin");
// const serviceAccount = require("../../serviceAccountKey.json");

// fcm.initializeApp({
//   credential: fcm.credential.cert(serviceAccount),
// });

const {	fcm } = require('./fcm');

const commonFunctions = {};

/**
 * function to convert an error into a readable form.
 * @param {} error
 */
commonFunctions.convertErrorIntoReadableForm = (error) => {
  let errorMessage = "";
  if (error.message.indexOf("[") > -1) {
    errorMessage = error.message.substr(error.message.indexOf("["));
  } else {
    errorMessage = error.message;
  }
  errorMessage = errorMessage.replace(/"/g, "");
  errorMessage = errorMessage.replace("[", "");
  errorMessage = errorMessage.replace("]", "");
  error.message = errorMessage;
  return error;
};

/***************************************
 **** Logger for error and success *****
 ***************************************/
commonFunctions.log = {
  info: (data) => {
    console.log("\x1b[33m" + data, "\x1b[0m");
  },
  success: (data) => {
    console.log("\x1b[32m" + data, "\x1b[0m");
  },
  error: (data) => {
    console.log("\x1b[31m" + data, "\x1b[0m");
  },
  default: (data) => {
    console.log(data, "\x1b[0m");
  },
};

/**
 * send fcm notification
 */
commonFunctions.sendFCMNotification = async (to, title, body, notificationId) => {
  console.log(to, title, body);

  fcm
    .messaging()
    .send({
      token: to,
      notification: {
        title: title,
        body: JSON.stringify({
			body,
			notificationId
		})
      }
    })
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

module.exports = commonFunctions;
