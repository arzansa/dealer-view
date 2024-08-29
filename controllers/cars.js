const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middleware/ensureLoggedIn");
const Car = require("../models/car.js");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
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
router.post("/", upload.single("image"), async (req, res) => {
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
    const car = await Car.findById(req.params.id).populate("addedBy"); // Populate addedBy if you need the username
    if (!car) {
      return res.status(404).send("Car not found");
    }
    res.render("cars/show.ejs", { car });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while retrieving the car");
  }
});

// DELETE /cars/:id - Delete a specific car
router.delete("/:id", ensureLoggedIn, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send("Car not found");
    }

    // Delete the associated image file if it exists
    if (car.image) {
      fs.unlink(car.image, (err) => {
        if (err) {
          console.error("Failed to delete image file:", err);
        }
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.redirect("/cars");
  } catch (err) {
    console.error("Error details:", err); // Log the error details
    res.status(500).send("An error occurred while deleting the car");
  }
});

// GET /cars/:id/edit - Display the form to edit a specific car
router.get("/:id/edit", ensureLoggedIn, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send("Car not found");
    }
    res.render("cars/edit.ejs", { car });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while retrieving the car for editing");
  }
});


// PUT /cars/:id - Update a specific car
router.put("/:id", ensureLoggedIn, upload.single("image"), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send("Car not found");
    }

    // Update the car details
    car.make = req.body.make;
    car.model = req.body.model;
    car.year = req.body.year;
    car.color = req.body.color;
    car.price = req.body.price;

    // Handle image update if a new file is uploaded
    if (req.file) {
      // Delete the old image file if it exists
      if (car.image) {
        fs.unlink(car.image, (err) => {
          if (err) {
            console.error("Failed to delete old image file:", err);
          }
        });
      }
      car.image = req.file.path; // Update the image path
    }

    await car.save(); // Save the updated car
    res.redirect(`/cars/${car._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while updating the car");
  }
});




module.exports = router;
