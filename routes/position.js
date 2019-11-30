'use strict';

const express = require('express'),
      passport = require('passport'),
      router = express.Router(),
      controller = require('../controllers/position');

router.get('/:category', passport.authenticate('jwt', {session: false}), controller.getAll);
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove);



module.exports = router;