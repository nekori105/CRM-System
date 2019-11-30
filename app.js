'use strict';

const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      keys = require('./config/keys'),
      authRouts = require('./routes/auth'),
      analyticRouts = require('./routes/analytic'),
      categoryRouts = require('./routes/category'),
      orderRouts = require('./routes/order'),
      positionRouts = require('./routes/position'),
      app = express(),
      path = require('path');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then ( () => {
        console.log('MongoDB connected');
    })
    .catch ((error) => {
        console.log(error);
    });
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/api/auth', authRouts);
app.use('/api/analytic', analyticRouts);
app.use('/api/category', categoryRouts);
app.use('/api/order', orderRouts);
app.use('/api/position', positionRouts);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('/client/dist/client'));

    app.get('*', (req, res) => {
       res.sendfile(
           path.resolve(
               __dirname, 'client', 'dist', 'client', 'index.html'
           )
       )
    });
}

module.exports = app;