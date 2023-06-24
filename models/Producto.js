import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
  titulo: {type: String, required:true},
  descripcion: String,
  precio: {type: Number, required: true},
  imagenes: {type: [String]},
  categoria: {type: mongoose.Types.ObjectId, ref:'Categoria'},
  propiedades: {type:Object},
}, {
  timestamps: true,
});

export const Producto = models.Producto || model('Producto', ProductSchema);