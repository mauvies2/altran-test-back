const LocalStrategy = require("passport-local").Strategy;
const { getData } = require("../src/database/database");
const { getDatabase } = require("../src/database/mongo");

const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        const User = await getDatabase();
        User.collection("users")
          .findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That email is not registered",
              });
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const User = await getDatabase();
    User.collection("users").findOne({}, async (err, user) => {
      return done(err, user);
    });
  });
};
