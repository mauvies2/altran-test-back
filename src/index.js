// ./src/index.js

// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { startDatabase } = require("./database/mongo");
const { getData } = require("./database/ads");
const { fetchData } = require("./API/fetchData");

const url1 = "http://www.mocky.io/v2/5808862710000087232b75ac";
const url2 = "http://www.mocky.io/v2/580891a4100000e8242b75c5";

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// defining an endpoint to return all ads
app.get("/clients", async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    if (req.query.hasOwnProperty("id")) {
      res.send(
        await getData("clients").then(
          (res) =>
            res[0].clients.filter((client) => client.id === req.query.id)[0]
        )
      );
    } else if (req.query.hasOwnProperty("name")) {
      res.send(
        await getData("clients").then(
          (res) =>
            res[0].clients.filter((client) => client.name === req.query.name)[0]
        )
      );
    }
  } else {
    res.send(await getData("clients"));
  }
});

app.get("/policies", async (req, res) => {
  res.send(await getData("policies"));
});

startDatabase().then(async () => {
  await fetchData(url1, "clients");
  await fetchData(url2, "policies");

  // starting the server
  app.listen(3001, async () => {
    console.log("listening on port 3001");
  });
});
