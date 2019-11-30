'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const categorySchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: ''
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('categories', categorySchema);