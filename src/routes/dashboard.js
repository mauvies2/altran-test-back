const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../../config/auth");
const { fetchData } = require("../API/fetchData");

const url1 = "http://www.mocky.io/v2/5808862710000087232b75ac";

// router.get("/", (req, res) =>
//   res.render(
//     "dashboard"
//     //   , {
//     //     name: req.user.name,
//     //   }
//   )
// );
router.get("/", async (req, res) => {
  // Check for query fields
  if (Object.keys(req.query).length !== 0) {
    if (req.query.hasOwnProperty("id")) {
      res.send(
        await fetchData(url1)
          .then((res) => res.filter((client) => client.id === req.query.id))
          .catch(() => console.log("Could not fetch data"))
      );
    } else if (req.query.hasOwnProperty("name")) {
      res.send(
        await fetchData(url1)
          .then((res) =>
            res.filter(
              (client) =>
                client.name.toLowerCase() === req.query.name.toLowerCase()
            )
          )
          .catch(() => console.log("Could not fetch data"))
      );
    }
  } else {
    const clients = await fetchData(url1);
    res.render("dashboard", { clients: clients });
  }
});

module.exports = router;
