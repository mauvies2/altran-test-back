const express = require("express");
const router = express.Router();
const { getDatabase } = require("../database/mongo");
const bcrypt = require("bcryptjs");
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password2, role } = req.body;
  let { password } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    const database = await getDatabase();
    database
      .collection("clients")
      .findOne({ email: email })
      .then((user) => {
        if (user) {
          // User exist
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
          });
        } else {
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              password = hash;
              database
                .collection("clients")
                .insertOne({
                  name,
                  email,
                  password,
                  role: role === "admincode" ? "admin" : "user",
                })
                .then(() => res.redirect("login"))
                .catch((err) => console.log(err));
            })
          );
        }
      });
  }
});

module.exports = router;
