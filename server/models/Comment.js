// Kode ini  membuat model untuk data komentar menggunakan Mongoose 
// dan  disiapkan untuk dapat digunakan pada  file JavaScript lain di dalam project.

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  komentar: {
    type: String,
    required: true
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
