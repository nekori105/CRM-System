'use strict';

const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      controller = require('../controllers/order');

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);



module.exports = router;