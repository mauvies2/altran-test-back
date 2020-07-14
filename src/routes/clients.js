const express = require("express");
const router = express.Router();
const { fetchData } = require("../API/fetchData");

const url1 = "http://www.mocky.io/v2/5808862710000087232b75ac";

router.get("/", async (req, res) => {
  const clients = await fetchData(url1);
  let errors = [];
  let client;
  // Check for query fields
  if (req.query.id && req.query.name) {
    const query = clients.filter(
      (client) =>
        client.id === req.query.id &&
        client.name.toLowerCase() === req.query.name.toLowerCase()
    )[0];
    query ? (client = query) : errors.push({ msg: "No client was found" });
  } else if (req.query.id) {
    const query = clients.filter((client) => client.id === req.query.id)[0];
    console.log(query);
    query ? (client = query) : errors.push({ msg: "No client was found" });
  } else {
    const query = clients.filter(
      (client) => client.name.toLowerCase() === req.query.name.toLowerCase()
    )[0];
    query ? (client = query) : errors.push({ msg: "No client was found" });
  }
  client
    ? res.render("clients", {
        errors,
        client,
      })
    : res.render("dashboard", {
        errors,
      });
});

module.exports = router;
