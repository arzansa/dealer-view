const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../middleware/ensureLoggedIn');


router.get("/", async (req, res) => {
  res.render("cars/index.ejs");
});

// GET /todos/new
// router.get('/new', ensureLoggedIn, (req, res) => {
//   res.send('Yay, you were logged in!');
// });

module.exports = router;