'use strict';

const express = require('express'),
      router = express.Router(),
      controller = require('../controllers/analytic'),
      passport = require('passport');

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview);
router.get('/analytic', passport.authenticate('jwt', {session: false}), controller.analytic);



module.exports = router;