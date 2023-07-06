const { Strategy } = require("passport-google-oauth20");
const passport = require("passport");
const User = require("../models/UserModal");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        // Verify or create user based on the Google profile
        try {
          // Find or create the user based on the Google profile information
          const existingUser = await User.findOne({ googleId: profile.id });
          console.log("This is Response", res);
          console.log("Existing", existingUser);
          if (existingUser) {
            // User already exists, send token
            const token = generateToken(existingUser);
            return done(null, { user: existingUser,token });
          }
          // User doesn't exist, create a new user with the Google profile information
          const newUser = new User({
            name: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            // You can set other required fields here
          });

          // Generate and send a token
          await newUser.save();

          return done(null, { user: newUser, token });
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

// Function to generate a token
const generateToken = (user) => {
  const token = jwt.sign({ id: toString(user._id) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

  return token;
};
