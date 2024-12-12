import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  id_producto: { 
    type: Number,
    required: true,
    unique: true 
  },
  categoria: { 
    type: String, 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  desc: { 
    type: String, 
    required: true 
  },
  precio: { 
    type: Number, 
    required: true 
  },
  imagen: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

productoSchema.pre('save', async function(next) {
  if (this.isNew) {
    const maxDoc = await this.constructor.findOne({}, { id_producto: 1 }, { sort: { id_producto: -1 } });
    this.id_producto = maxDoc ? maxDoc.id_producto + 1 : 1;
  }
  next();
});

export default mongoose.model('Producto', productoSchema);