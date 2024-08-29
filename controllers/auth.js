const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');




router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});


router.post('/sign-up', async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      throw new Error('Password & confirmation do not match');
    }
    req.body.password = bcrypt.hashSync(req.body.password, 6);
    const user = await User.create(req.body);
    console.log('User created:', user); 
    req.session.user = { _id: user._id };
    req.session.save((err) => {
      if (err) {
        console.log('Session save error:', err);
      } else {
        console.log('Session saved successfully');
      }
      res.redirect('/');
    });
  } catch (err) {
    console.log('Sign-up error:', err);
    res.redirect('/auth/sign-up');
  }
});


router.post('/login', async (req, res) => {
  try {
    
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.redirect('/auth/login');
    }
    
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = { _id: user._id };
      req.session.save();
      return res.redirect('/');
    } else {
      return res.redirect('/auth/login');
    }
  } catch (err) {
    console.log('Login error:', err);
    res.redirect('/');
  }
});


router.get('/login', async (req, res) => {
  res.render('auth/login.ejs');
});


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
