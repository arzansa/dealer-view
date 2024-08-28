const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');


router.get("/", async (req, res) => {
  res.render("cars/index.ejs");
});

// GET /cars/new
router.get('/new', ensureLoggedIn, (req, res) => {
  res.render("cars/new.ejs");
});

module.exports = router;