// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const passport = require("passport");
// require("dotenv").config();


// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: process.env.CLIENT_ID,
// 			clientSecret: process.env.CLIENT_SECRET,
// 			callbackURL: "/auth/google/callback",
// 			scope: ["profile", "email"],
// 		},
// 		function (accessToken, refreshToken, profile, callback) {
// 			// Extract email from profile
// 			const email = profile.emails?.[0]?.value;

// 			// Check if email is valid (contains '@bitsathy.ac.in')
// 			if (email && email.endsWith("@bitsathy.ac.in")) {
// 				callback(null, profile);
// 			} else {
// 				callback(new Error("Unauthorized: Email must be from bitsathy.ac.in"), null);
// 			}
// 		}
// 	)
// );

// passport.serializeUser((user, done) => {
// 	done(null, user);
// });

// passport.deserializeUser((user, done) => {
// 	done(null, user);
// });
