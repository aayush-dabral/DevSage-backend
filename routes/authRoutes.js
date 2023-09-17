const router = require('express').Router();
const passport = require('passport')
const { signup, login, logout } = require('../controllers/authControllers')
const User = require('../models/User')
const Authenticate = require('../middleware/Authenticate')

//Ensure logged in and logged out
router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', Authenticate, logout);

module.exports = router;