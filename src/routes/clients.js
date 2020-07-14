const express = require("express");
const router = express.Router();
const { getData } = require("../database/database");

const { ensureAuthenticated } = require("../../config/auth");

router.get("/", ensureAuthenticated, async (req, res) => {
  console.log(req.user.name);
  const clients = await getData("clients");
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
