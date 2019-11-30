'use strict';

const express = require('express'),
      controller = require('../controllers/auth'),
      router = express.Router();
     

//localhost:5000/api/auth/login
router.post('/login', controller.login);
//localhost:5000/api/auth/register
router.post('/register', controller.register);

module.exports = router;