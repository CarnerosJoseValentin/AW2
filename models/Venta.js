import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const itemSchema = new mongoose.Schema({
  id_producto: {
    type: Number,
    required: true,
    ref: 'Producto'
  },
  cant: {
    type: Number,
    required: true
  }
});

const ventaSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  id_usuario: {
    type: Number,
    required: true,
    ref: 'Usuario'
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  total: {
    type: Number,
    required: true
  },
  id_sucursal: {
    type: Number,
    required: true,
    default: 1
  },
  descripcion: [itemSchema]
}, {
  timestamps: true
});

ventaSchema.plugin(AutoIncrement, {
  inc_field: 'id',
  start_seq: 1
});

export default mongoose.model('Venta', ventaSchema);