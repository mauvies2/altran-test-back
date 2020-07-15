// Importing the dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const passport = require("passport");

const { getDatabase } = require("../database/mongo");
const { insertUser } = require("../database/database");

// Routes
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

// User register handle
router.post("/register", async (req, res) => {
  const { name, email, password2, role } = req.body;
  let { password } = req.body;

  let errors = [];

  // Check all required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check that passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check password length
  if (password.length < 4) {
    errors.push({ msg: "Password should be at least 4 characters" });
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
      .collection("users")
      .findOne({ email: email })
      .then((user) => {
        if (user) {
          // User exists
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
          });
        } else {
          // Hash password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              password = hash;
              // Add user to in-memory database
              insertUser({
                name,
                email,
                password,
                role: role === "admincode" ? "admin" : "user",
              })
                .then(() => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("login");
                })
                .catch((err) => console.log(err));
            })
          );
        }
      });
  }
});

// Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
