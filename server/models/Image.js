// Dibuat oleh Aliyah
// Kode ini  mendefinisikan skema untuk menyimpan informasi gambar di database MongoDB 

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);