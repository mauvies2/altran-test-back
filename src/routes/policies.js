const express = require("express");

const router = express.Router();

// Clients url
const url2 = "http://www.mocky.io/v2/580891a4100000e8242b75c5";

router.get("/", async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    if (req.query.hasOwnProperty("clientId")) {
      res.send(
        await fetchData(url2).then((res) =>
          res.filter((policy) => policy.clientId === req.query.clientId)
        )
      );
    } else if (req.query.hasOwnProperty("id")) {
      res.send(
        await fetchData(url2).then((res) =>
          res.filter((policy) => policy.id === req.query.id)
        )
      );
    }
  } else {
    res.send(await fetchData(url2));
  }
});

module.exports = router;
