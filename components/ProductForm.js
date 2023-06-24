import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { images } from "@/next.config";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  titulo:tituloActual, 
  descripcion:descripcionActual, 
  precio:precioActual,
  imagenes: imagenesExistentes,
  categoria: categoriaAsignada,
  propiedades: propiedadesAsignadas,
}) {
  const [titulo, setTitulo] = useState(tituloActual || '');
  const [descripcion, setDescripcion] = useState(descripcionActual || '');
  const [categoria, setCategoria] = useState(categoriaAsignada || '');
  const [propiedadesProducto, setPropiedadesProducto] = useState(propiedadesAsignadas || {});
  const [precio, setPrecio] = useState(precioActual || '');
  const [imagenes, setImagenes] = useState(imagenesExistentes || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get('/api/categorias').then(result => {
      setCategorias(result.data);
    })
  }, []);
  async function guardarProducto(ev) {
    ev.preventDefault();
    const data = {titulo, descripcion, precio, imagenes, categoria, propiedades:propiedadesProducto};
    if (_id) { //Si hay un id
      //update
      await axios.put('/api/productos', {...data, _id});
    } else { //si no
      //create
      await axios.post('/api/productos', data);
    }
    setGoToProducts(true); //volvemos al inicio
  }
  if (goToProducts) { // hay q cambiar el estado a false?
    router.push('/productos');
  }

  async function subirImagenes(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData(); //ver de donde sale el formdata
      for (const file of files) {
        if (file instanceof File) { //ver de limitar el tipo de archivo a .jpg, .png, etc..
          data.append('file', file); //ver si influye lo de arriba
        }
      }

      const res = await axios.post('/api/subir', data);
        setImagenes(imagenesViejas => {
          return [...imagenesViejas, ...res.data.links];
        });
        setIsUploading(false);
    }
  }

  function cargarOrdenImagenes(imagenes) {
    setImagenes(imagenes);
  }

  function setPropiedadProducto(propName, value) {
    setPropiedadesProducto(prev => {
      const newProductProps = {...prev}; //propiedades viejas
      newProductProps[propName] = value; //propiedades nuevas
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categorias.length > 0 && categoria) {
    let catInfo = categorias.find(({_id}) => _id === categoria);
    propertiesToFill.push(...catInfo.propiedades);
    while(catInfo?.parent?._id) {
      const parentCat = categorias.find(({_id}) => _id === catInfo?.padre?._id);
      propertiesToFill.push(...parentCat.propiedades);
      catInfo = parentCat;
    }
  }

  return (
      <form onSubmit={guardarProducto}>
        <label>Nombre del producto</label>
        <input 
          type="text" 
          placeholder="Nombre del producto"
          value={titulo}
          onChange={ev => setTitulo(ev.target.value)}
        />
        <label>Categoria</label>
        <select value={categoria} onChange={ev => setCategoria(ev.target.value)}>
          <option value="">Sin categoria</option>
          {categorias.length > 0 && categorias.map(c => (
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>

          {propertiesToFill.length > 0 && propertiesToFill.map(p => (
            <div className="">
              <label>{p.nombre[0].toUpperCase()+p.nombre.substring(1)}</label>
            <div>
            <select value={propiedadesProducto[p.nombre]} onChange={ev => setPropiedadProducto(p.nombre, ev.target.value)}>
                  {p.valores.map(v => (
                    <option value={v}>{v}</option>
                  ))}
              </select>
            </div>
            </div>
          ))}

        <label>
          Imagenes
        </label>
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable 
            list={imagenes}
            className="flex flex-wrap gap-1"
            setList={cargarOrdenImagenes}>
          {!!imagenes?.length && imagenes.map(link => (
            <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-300">
              <img src={link} alt="" className="rounded-lg"/>
            </div>
          ))}
          </ReactSortable>
          {isUploading && (
            <div className="h24 flex items-center">
              <Spinner />
            </div>
          )}
          <label className=" w-24 h-24 text-center cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-gray-200 shadow-sm border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Agregar
            </div>
            <input type="file" onChange={subirImagenes} className="hidden" />
          </label>
        </div>
        <label>Descripcion</label>
        <textarea 
          type="text"
          placeholder="Descripcion"
          value={descripcion}
          onChange={ev => setDescripcion(ev.target.value)}
        />
        <label>Precio</label>
        <input 
          type="text" 
          placeholder="Precio"
          value={precio}
          onChange={ev => setPrecio(ev.target.value)}
        />
      <button type="submit" className="btn-primary">Guardar</button>
      </form>
  );
};

//chequear el (ev)..