const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('password and confirm password must match');
  }

  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send('username is already taken');
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}. Welcome aboard, good
  buddy!`);
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.send('no user in the db, my dog');
  }

  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );

  if (!validPassword) {
    return res.send('your password is wrooooooong. You should feel bad.');
  }

  req.session.user = {
    username: userInDatabase.username,
  };

  res.redirect('/')

});

module.exports = router;



















