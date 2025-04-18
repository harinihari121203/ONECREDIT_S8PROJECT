const admin = require("firebase-admin");
const serviceAccount = require("../onecredit-86fc4-firebase-adminsdk-fbsvc-0b445d0b8a.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;