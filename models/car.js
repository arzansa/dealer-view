const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  }
});

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  features: [featureSchema],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  image: {
    type: String,
    required: false,
  }
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
