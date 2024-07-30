const fcm = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

fcm.initializeApp({
  credential: fcm.credential.cert(serviceAccount),
});

module.exports = { fcm };
