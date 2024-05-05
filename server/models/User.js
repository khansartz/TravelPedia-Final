// Dibuat oleh khansa
//Kode ini mendefinisikan skema untuk dokumen yang akan disimpan dalam koleksi User di database MongoDB
// Kode ini digunakan untuk menyimpan data dari user admin yang dibuat


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type : String,
        required: true,
        unique : true
    },
    password: {
        type : String, 
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);