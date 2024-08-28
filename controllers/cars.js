const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middleware/ensureLoggedIn");
const Car = require("../models/car.js");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.get("/", async (req, res) => {
  const allCars = await Car.find({});
  res.render("cars/index.ejs", {
    cars: allCars,
  });
});

// GET /cars/new
router.get("/new", ensureLoggedIn, (req, res) => {
  res.render("cars/new.ejs");
});

// POST /cars (Create a car functionality / action)
router.post("/", upload.single('image'), async (req, res) => {
  try {
    const newCar = new Car({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      price: req.body.price,
      features: req.body.features,
      addedBy: req.session.user._id,
      image: req.file ? req.file.path : null,
    });
    await newCar.save();
    res.redirect("/cars");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// GET /cars/:id - Display details for a specific car
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('addedBy'); // Populate addedBy if you need the username
    if (!car) {
      return res.status(404).send("Car not found");
    }
    res.render("cars/show.ejs", { car });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while retrieving the car");
  }
});

module.exports = router;
