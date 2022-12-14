const bCrypt = require("bcryptjs");
module.exports = function (passport, user) {
  let User = user;
  const LocalStrategy = require("passport-local").Strategy;
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        let generateHash = function (password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        User.findOne(
          {
            where: {
              email: email,
            },
          },
          (err, user) => {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(
                null,
                false,
                req.flash("message", "That email is already taken")
              );
            } else {
              let userPassword = generateHash(password);
              let data = {
                email: email,
                password: userPassword,
                username: req.body.username,
              };
              User.create(data).then(function (newUser, created) {
                if (!newUser) {
                  return done(null, false);
                }
                if (newUser) {
                  return done(null, newUser);
                }
              });
            }
          }
        );
      }
    )
  );

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (_, email, password, done) {
        let User = user;
        let isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };
        User.findOne({
          where: {
            email: email,
          },
        })
          .then(function (err, User) {
            if (err) {
              return done(err);
            }
            if (!User) {
              return done(null, false, {
                message: "Email does not exist",
              });
            }
            if (!isValidPassword(User.password, password)) {
              return done(null, false, {
                message: "Incorrect password.",
              });
            }
            let userinfo = User.get();
            return done(null, userinfo);
          })
          .catch(function (err) {
            console.log("Error:", err);
            return done(null, false, {
              message: "Something went wrong with your Signin",
            });
          });
        //serialize
        passport.serializeUser(function (user, done) {
          done(null, user.id);
        });
        // deserialize user
        passport.deserializeUser(function (id, done) {
          User.findByPk(id).then(function (user) {
            if (user) {
              done(null, user.get());
            } else {
              done(user.errors, null);
            }
          });
        });
      }
    )
  );
};
