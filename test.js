const express = require("express");

// const { getData } = require("./src/database/database");
const { startDatabase } = require("./src/database/mongo");
const {
  getData,
  aggregateClientsPolicies,
} = require("./src/database/database");
const { fetchDataToDatabase } = require("./src/API/fetchData");

const app = express();

const url1 = "http://www.mocky.io/v2/5808862710000087232b75ac";
const url2 = "http://www.mocky.io/v2/580891a4100000e8242b75c5";

startDatabase().then(async () => {
  await fetchDataToDatabase(url1, "clients");
  await fetchDataToDatabase(url2, "policies");
  await fetchDataToDatabase(url1, "clients_policies");
  await aggregateClientsPolicies();

  await getData("clients_policies").then((res) => console.log(res));

  // starting the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
  });
});
