import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BorrarProductoPage() {
  const router = useRouter()
  const [productInfo, setProductInfo] = useState();
  const {id} = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/productos?id='+id).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push('/productos');
  }

  async function borrarProducto() {
    await axios.delete('/api/productos?id='+id)
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">Do you really want to delete 
      &nbsp;"{productInfo?.titulo}"?</h1>
      <div className="flex gap-2 justify-center">
        <button 
          className="btn-red"
          onClick={borrarProducto}>Yes</button>
        <button 
          className="btn-default" 
          onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  )
}