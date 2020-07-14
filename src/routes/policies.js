const express = require("express");

const router = express.Router();

const { getDatabase } = require("../database/mongo");

const { ensureAuthenticated } = require("../../config/auth");

// Policies url

router.get("/", ensureAuthenticated, async (req, res) => {
  let errors = [];
  let policies;
  let client;
  const database = await getDatabase();
  if (req.query.name) {
    await database
      .collection("clients_policies")
      .aggregate([
        {
          $lookup: {
            from: "policies",
            localField: "id",
            foreignField: "clientId",
            as: "policies",
          },
        },
      ])
      .toArray(function (err, arr) {
        if (err) throw err;
        // Check for query fields
        const query = arr.filter(
          (client) => client.name.toLowerCase() === req.query.name.toLowerCase()
        )[0];
        if (query) {
          policies = query.policies;
          return res.render("policies", {
            policies,
            client,
          });
        } else {
          errors.push({
            msg: "No client was found",
          });
          return res.render("dashboard", {
            errors,
          });
        }
      });
  } else if (req.query.id) {
    await database
      .collection("policies")
      .aggregate([
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "id",
            as: "clientId",
          },
        },
      ])
      .toArray(function (err, arr) {
        if (err) throw err;
        // Check for query fields
        // console.log(JSON.stringify(arr));
        const query = arr.filter(
          (policy) => policy.clientId[0].id === req.query.id
        )[0];
        if (query) {
          client = query.clientId[0];
          return res.render("policies", {
            client,
            policies,
          });
        } else {
          errors.push({
            msg: "Please introduce a valid policy number",
          });
          return res.render("dashboard", {
            errors,
          });
        }
      });
  } else {
    errors.push({
      msg: "Please introduce a valid policy number",
    });
    return res.render("dashboard", {
      errors,
    });
  }
});

module.exports = router;
