const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  likedCars: [carSchema], 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
