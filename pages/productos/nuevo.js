import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";

export default function NuevoProducto() {
  return (
    <Layout>
      <h1>Nuevo producto</h1>
      <ProductForm />
    </Layout>
  )
}