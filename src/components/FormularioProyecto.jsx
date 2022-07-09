import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos'
import Alerta from "../components/Alerta";
const FormularioProyecto = () => {

const [id, setId] = useState(null)
const [nombre, setNombre] = useState('')
const [descripcion, setDescripcion] = useState('')
const [fechaEntraga, setFechaEntrega] = useState('')
const [cliente, setCliente] = useState('')

/*Extraccion del id que tenemos por url cuando usamos este componete para editar*/

const params = useParams()

/*Extraccion de elementos del ProyectosProvider */

const {proyectos, mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos();


/*Verificacion de si existe id, si es asi el formualrio es para editar*/ 
useEffect(() => {
    if(params.id ){
        setId(proyecto._id)
        setNombre(proyecto.nombre)
        setDescripcion(proyecto.descripcion)
        setFechaEntrega(proyecto.fechaEntraga?.split('T')[0])
        //setFechaEntrega(proyecto.fechaEntraga)
        setCliente(proyecto.cliente)
    }
}, [params])


const handleSubmit = e =>{
    e.preventDefault();

    if([nombre, descripcion, fechaEntraga, cliente].includes('')){

        mostrarAlerta({
            msg: 'Todos los campos son obligatorios',
            error: true
        })

        return
    }

    //Pasando datos al ProyectosProvider
        submitProyecto({id, nombre, descripcion, fechaEntraga, cliente})

    //limpiando el formulario despues del envio
        setId(null)     
        setNombre('')
        setDescripcion(''),
        setFechaEntrega(''),
        setCliente('')

}

const {msg} = alerta;

  return (
    <form onSubmit={handleSubmit} className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'>

        {msg && <Alerta alerta={alerta}/> }

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm ' htmlFor="nombre">Nombre Proyecto:</label>
            <input className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
            type="text" id='nombre' placeholder='Nombre del proyecto' value={nombre} onChange={e => setNombre(e.target.value)}/>
        </div>

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm ' htmlFor="descripcion">Descripcion Proyecto:</label>
            <textarea className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
            id='descripcion' placeholder='Descripcion del proyecto' value={descripcion} onChange={e => setDescripcion(e.target.value)}/>
        </div>

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm ' htmlFor="fecha">Fecha Entrega:</label>
            <input className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
            type="date" id='fecha' value={fechaEntraga} onChange={e => setFechaEntrega(e.target.value)}/>
        </div>

        <div className='mb-5'>
            <label className='text-gray-700 uppercase font-bold text-sm ' htmlFor="cliente">Nombre Cliente:</label>
            <input className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
            type="text" id='cliente' placeholder='Nombre del cliente' value={cliente} onChange={e => setCliente(e.target.value)}/>
        </div>

        <input className='bg-green-700 hover:bg-green-800 w-full text-white p-3 rounded uppercase cursor-pointer font-bold'
         type="submit" value={id ? 'Actualizar proyecto' : 'Crear Proyecto'} />
      
    </form>
  )
}

export default FormularioProyecto
