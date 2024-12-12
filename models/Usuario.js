import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  id_usuario: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contraseña: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Usuario', usuarioSchema);