const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../middleware/ensureLoggedIn");
const Car = require("../models/car.js");
const multer = require("multer");
const path = require("path");
const fs = require('fs');


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


router.get("/new", ensureLoggedIn, (req, res) => {
  res.render("cars/new.ejs");
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newCar = new Car({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      price: req.body.price,
      mileage: req.body.mileage,
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


router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('addedBy');
    if (!car) {
      return res.status(404).send("Car not found");
    }
    res.render("cars/show.ejs", { car });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while retrieving the car");
  }
});


router.delete("/:id", ensureLoggedIn, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send("Car not found");
    }

    
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
    console.error("Error details:", err); 
    res.status(500).send("An error occurred while deleting the car");
  }
});


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



router.put("/:id", ensureLoggedIn, upload.single("image"), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).send("Car not found");
    }

    
    car.make = req.body.make;
    car.model = req.body.model;
    car.year = req.body.year;
    car.color = req.body.color;
    car.price = req.body.price;
    car.mileage = req.body.mileage;

    
    if (req.file) {
      
      if (car.image) {
        fs.unlink(car.image, (err) => {
          if (err) {
            console.error("Failed to delete old image file:", err);
          }
        });
      }
      car.image = req.file.path; 
    }

    await car.save(); 
    res.redirect(`/cars/${car._id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while updating the car");
  }
});




module.exports = router;
