const { Schema, model } = require('mongoose');
const path = require('path');

const ImageShema = new Schema({
    title: { type: String },
    description: { type: String },
    filename: { type: String },
    views: { type: Number, default: 0},
    likes: { type: Number, default: 0},
    user: { type: String },
    timestamp: { type: Date, default: Date.now},
});

ImageShema.virtual('uniqueId')
    .get(function () {
        return this.filename.replace(path.extname(this.filename), '')
    });

module.exports = model('Image', ImageShema);