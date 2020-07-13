// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const { startDatabase } = require("./database/mongo");
const { getData } = require("./database/database");
const { fetchDataToDatabase } = require("./API/fetchData");

const url1 = "http://www.mocky.io/v2/5808862710000087232b75ac";
const url2 = "http://www.mocky.io/v2/580891a4100000e8242b75c5";

const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// EJS templates
app.use(expressLayouts);
app.set("view engine", "ejs");

// bodyparser
app.use(express.urlencoded({ extended: false }));

// defining endpoints to return data
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

app.get("/clients", async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    if (req.query.hasOwnProperty("id")) {
      res.send(
        await getData("clients").then((res) =>
          res.filter((client) => client.id === req.query.id)
        )
      );
    } else if (req.query.hasOwnProperty("name")) {
      res.send(
        await getData("clients").then((res) =>
          res.filter(
            (client) =>
              client.name.toLowerCase() === req.query.name.toLowerCase()
          )
        )
      );
    }
  } else {
    res.send(await getData("clients"));
  }
});

app.get("/policies", async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    if (req.query.hasOwnProperty("clientId")) {
      res.send(
        await getData("policies").then((res) =>
          res.filter((policy) => policy.clientId === req.query.clientId)
        )
      );
    } else if (req.query.hasOwnProperty("id")) {
      res.send(
        await getData("policies").then((res) =>
          res.filter((policy) => policy.id === req.query.id)
        )
      );
    }
  } else {
    res.send(await getData("policies"));
  }
});

startDatabase().then(async () => {
  await fetchDataToDatabase(url1, "clients");
  await fetchDataToDatabase(url2, "policies");

  // starting the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
  });
});
