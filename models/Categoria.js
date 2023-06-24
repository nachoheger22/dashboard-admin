import mongoose, {model, Schema, models} from "mongoose"

const CategoriaSchema = new Schema({
  nombre: {type:String, required:true},
  padre: {type:mongoose.Types.ObjectId, ref: 'Categoria'},
  propiedades: [{type:Object}]
});

export const Categoria = models?.Categoria || model('Categoria', CategoriaSchema);

