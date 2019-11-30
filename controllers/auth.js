'use strict';
const bcrypt = require('bcryptjs'),
      User = require('../models/User'),
      jwt = require('jsonwebtoken'),
      errorHandler = require('../utils/errorHandlers'),
      keys = require('../config/keys');

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    });
    if (candidate) {
        // user found, check password
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password) ;
        if (passwordResult) {
            // token generation
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 3600}) ;
            res.status(200).json({
                token: `Bearer ${token}`
            });
        } else {
            //error. Password incorrect
            res.status(401).json({
                message:' Password incorrect'
            });
        }
    } else {
        // user not found, error
        res.status(404).json({
            message: 'User not found'
        });
    }
};

module.exports.register = async function(req, res) {    
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        // if user exist - send error
        res.status(409).json({
            message: 'Такой email уже занят'
        });
    } else {
        // create user
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User ({
            email : req.body.email,
            password: bcrypt.hashSync(password, salt)
        });
        try {
        await user.save();
         res.status(201).json(user);
        } catch(e) {
            errorHandler(res, e);
        }
    }
};