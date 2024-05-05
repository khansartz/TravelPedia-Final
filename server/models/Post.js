// Dibuat oleh Khansa
//Kode ini mendefinisikan skema untuk dokumen yang akan disimpan dalam koleksi Post di database MongoDB
//Kode ini digunakan untuk menyimpan berbagai postingan yang dibuat

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);