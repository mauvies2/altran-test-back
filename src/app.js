// Importing the dependencies
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");

const passport = require("passport");

// Passport config
require("../config/passport")(passport);

const { startDatabase } = require("./database/mongo");
const { fetchDataToDatabase } = require("./API/fetchData");

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

const url1 = "http://www.mocky.io/v2/5808862710000087232b75ac";
const url2 = "http://www.mocky.io/v2/580891a4100000e8242b75c5";

// Adding Helmet to enhance your API's security
app.use(helmet());

// Using bodyParser to parse JSON bodies into JS objects
app.use(bodyparser.json());

// Enabling CORS for all requests
app.use(cors());

// Adding morgan to log HTTP requests
app.use(morgan("combined"));

// EJS templates
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Globa vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// defining endpoints to return data
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/dashboard/clients", require("./routes/clients"));
app.use("/dashboard/policies", require("./routes/policies"));

startDatabase().then(async () => {
  await fetchDataToDatabase(url1, "clients");
  await fetchDataToDatabase(url2, "policies");
  await fetchDataToDatabase(url1, "clients_policies");

  // starting the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
  });
});
