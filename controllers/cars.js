const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middleware/ensureLoggedIn");
const Car = require("../models/car.js");

router.get("/", async (req, res) => {
  res.render("cars/index.ejs");
});

// GET /cars/new
router.get("/new", ensureLoggedIn, (req, res) => {
  res.render("cars/new.ejs");
});

module.exports = router;

// POST /recipes (Create a recipe functionality / action)
router.post("/", async (req, res) => {
  try {
    const newCar = new Car({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      price: req.body.price,
      features: req.body.features, // Assuming features are sent as an array in the request body
      addedBy: req.session.user._id, // Assuming the user's ID is stored in the session
      image: req.file ? req.file.path : null, // Storing the file path if an image is uploaded
    });
    await newCar.save();
    res.redirect("/cars");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
