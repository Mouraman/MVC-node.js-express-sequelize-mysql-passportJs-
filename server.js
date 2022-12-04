const express = require("express");
let app = express();
const passpartout = require("passport");
const session = require("express-session");
const env = require("dotenv").config();
const exphbs = require("express-handlebars");
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// For Passport
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
); // session secret
app.use(passpartout.initialize());
app.use(passpartout.session()); // persistent login sessions

//For Handlebars
app.set("views", "./app/views");
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts/",
  })
);
app.set("view engine", ".hbs");
app.get("/", function (req, res) {
  res.send("Welcome to node.js api");
});
//Models
const models = require("./app/models");
//Routes
const authRoute = require("./app/routes/auth.js")(app, passpartout);
//load passport strategies
require("./app/config/passport/passport.js")(passpartout, models.user);
//Sync Database
models.sequelize
  .sync()
  .then(function () {
    console.log("Nice! Database looks fine");
  })
  .catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
  });
//SERVER ON
app.listen(3000, function (err) {
  if (!err) {
    console.log("Server is Up!");
  } else {
    console.log(err);
  }
});
