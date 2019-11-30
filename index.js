'use strict';

const app = require('./app'),
      PORT = (process.env.PORT || 5000);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Working'
    });
});

app.listen(PORT, () => {
    console.log(`server has been started on ${PORT}...`);
});