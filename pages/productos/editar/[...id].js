import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditarProductoPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/productos?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id])

  return (
    <Layout>
      <h1>Editar producto</h1>
      {productInfo && (
        <ProductForm {...productInfo} />
      )}
    </Layout>
  )
}