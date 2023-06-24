import mongoose from "mongoose";
import {Producto} from "@/models/Producto";
import {mongooseConnect} from "@/lib/mongoose";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req, res);


// GET
  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Producto.findOne({_id:req.query.id}));
    } else {
      res.json(await Producto.find());
    }
  }

//POST 
  if (method === 'POST') {
    const {titulo, descripcion, precio, imagenes, categoria, propiedades} = req.body;
    const productDoc = await Producto.create ({
      titulo, descripcion, precio, imagenes, categoria, propiedades
    })
    res.json(productDoc);
  }

//PUT
  if (method === 'PUT') {
    const {titulo, descripcion, precio, imagenes, categoria, propiedades, _id} = req.body;
    await Producto.updateOne({_id}, {titulo, descripcion, precio, imagenes, categoria, propiedades});
    res.json(true)
  }

//DELETE
  if (method === 'DELETE') {
    if (req.query?.id) {
      await Producto.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}