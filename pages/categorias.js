import Layout from "@/components/Layout"
import { useState, useEffect } from "react"
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categorias({swal}) {
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [nombre, setNombre] = useState('');
  const [categoriaPadre, setCategoriaPadre] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    fetchCategorias();
  }, []);

  function fetchCategorias() {
    axios.get('/api/categorias').then(result => {
      setCategorias(result.data);
    });
  }

  async function guardarCategoria(ev) {
    ev.preventDefault();
    const data = {
      nombre,
      categoriaPadre,
      propiedades:propiedades.map(p => ({
        nombre: p.nombre,
        valores:p.valores.split(',')
      })
      )
    }
    if (categoriaEditada) {
      data._id = categoriaEditada._id;
      await axios.put('./api/categorias', data);
      setCategoriaEditada(null);
    } else {
      await axios.post('/api/categorias', data);
    }
    setNombre('');
    setCategoriaPadre('');
    setPropiedades([]);
    fetchCategorias();
  };

  function editarCategoria(categoria) {
    setCategoriaEditada(categoria);
    setNombre(categoria.nombre);
    setCategoriaPadre(categoria.padre?._id);
    setPropiedades(categoria.propiedades.map(({nombre, valores}) => ({
      nombre,
      valores:valores.join(',')
    }))
    );
  }

  function borrarCategoria(categoria) {
    swal.fire({
      title: 'Estas seguro?',
      text: `Queres borrar la categoria ${categoria.nombre}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, borrar',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const {_id} = categoria;
        await axios.delete('/api/categorias?_id='+_id);
        fetchCategorias();
      }
    }).catch(error => {
        // when promise rejected...
    });
  }

  function agregarPropiedad() {
    setPropiedades(prev => {
      return [...prev, {nombre:'', valores:''}];
    })
  }

  function handlePropertyNameChange(index, propiedad, nuevoNombre) {
    setPropiedades(prev => {
      const propiedades = [...prev];
      propiedades[index].nombre = nuevoNombre;
      return propiedades;
    });
  }

  function handlePropertyValuesChange(index, propiedad, nuevosValores) {
    setPropiedades(prev => {
      const propiedades = [...prev];
      propiedades[index].valores = nuevosValores;
      return propiedades;
    });
  }

  function borrarPropiedad(indexToRemove) {
    setPropiedades(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
      return nuevasPropiedades;
    })
  }

  return (
    <Layout>
      <h1>Categorias</h1>
      <label>{categoriaEditada ? `Editar categoria ${categoriaEditada.nombre}` : 'Nueva categoria'}</label>
      <form onSubmit={guardarCategoria}>
        <div className="flex gap-1">
          <input 
            type="text"
            placeholder={'Nombre de categoria'}
            onChange={ev => setNombre(ev.target.value)}
            value={nombre}/>
          <select 
            onChange={ev => setCategoriaPadre(ev.target.value)}
            value={categoriaPadre}>
              <option value="">Sin categoria padre</option>
              {categorias.length > 0 && categorias.map(categoria => (
                <option key={categoria._id} value={categoria._id}>{categoria.nombre}</option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Propiedades</label>
          <button 
            type="button"
            onClick={agregarPropiedad}
            className="btn-default text-sm mb-2">
            Agregar nueva propiedad
          </button>
          {propiedades.length > 0 && propiedades.map((propiedad, index) => (
            <div className="flex gap-1 mb-2">
              <input 
                type="text" 
                className="mb-0"
                value={propiedad.nombre} 
                onChange={ev => handlePropertyNameChange(index, propiedad, ev.target.value)}
                placeholder="Nombre de la propiedad (ejemplo: color)" />
              <input 
                type="text"
                className="mb-0"
                value={propiedad.valores}
                onChange={ev => handlePropertyValuesChange(index, propiedad, ev.target.value)}
                placeholder="Valores (ejemplo: rojo)"/>
              <button
                onClick={() => borrarPropiedad(index)}
                type="button"
                className="btn-default">Borrar
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {categoriaEditada && (
            <button 
              type="button" 
              onClick={() => {
                setCategoriaEditada(null); 
                setNombre('');
                setCategoriaPadre('');
                setPropiedades([]);
              }} 
              className="btn-default">
                Cancelar
            </button>
          )}
            <button 
              type="submit"
              className="btn-primary py-1">
                Guardar
            </button>
        </div>
      </form>
      {!categoriaEditada && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nombre de la categoria</td>
              <td>Categoria padre</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 && categorias.map
              (categoria => (
                <tr key={categoria._id}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria?.padre?.nombre}</td>
                  <td>
                    <div className="flex">
                      <button 
                        onClick={() => editarCategoria(categoria)} 
                        className="btn-primary mr-1"
                      >
                        Editar
                      </button>
                      <button onClick={() => borrarCategoria(categoria)} className="btn-primary">
                        Borrar</button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}


export default withSwal(({swal}, ref) => (
  <Categorias swal={swal} />
));