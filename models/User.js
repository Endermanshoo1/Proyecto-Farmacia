const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'] }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports=Usuario;