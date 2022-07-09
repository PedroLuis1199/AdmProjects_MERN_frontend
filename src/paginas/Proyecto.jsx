import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import Colaborador from '../components/Colaborador'
import Tarea from '../components/Tarea'
import Alerta from '../components/Alerta'
import useAdmin from '../hooks/useAdmin'
import ModalEliminarColaborador from '../components/ModalEliminarColaborador'
import io from 'socket.io-client'

let socket;


const Proyecto = () => {

const params = useParams()

//extraccion de elementos necesarios para el proyecto

const {obtenerProyecto, proyecto, cargando, handleModalTarea, alerta,submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea} = useProyectos()

//extraccion del hook de admin

const admin = useAdmin()
console.log(admin)

useEffect(() =>{
  obtenerProyecto(params.id)
}, [])

//effect para conectarse a socket io
useEffect(() => {
  socket = io(import.meta.env.VITE_BACKEND_URL)
  //evento
  socket.emit('abrir proyecto', params.id )
}, [ ])

//agregar tarea
useEffect(() => {
  socket.on('tarea agregada', tareaNueva => {
    if(tareaNueva.proyecto === proyecto._id){
      submitTareasProyecto(tareaNueva)
    }
  
  })

  //eliminar tarea
  socket.on('tarea eliminada', tareaEliminada => {
    if(tareaEliminada.proyecto === proyecto._id){
      eliminarTareaProyecto(tareaEliminada)
    }
  })

  //actualizar tarea
  socket.on('tarea actualizada', tareaActualizada => {
    if(tareaActualizada.proyecto._id === proyecto._id){
      actualizarTareaProyecto(tareaActualizada)
    }
  })

  //cambiar estado
  socket.on('nuevo estado', nuevoEstadoTarea => {
    if(nuevoEstadoTarea.proyecto._id === proyecto._id){
      cambiarEstadoTarea(nuevoEstadoTarea)
    }
  })

})

const {nombre, fechaEntrega, descripcion, cliente, tareas} = proyecto

if(cargando) return 'Cargando'
const {msg} = alerta

  return  (

    <>
      <div className='flex justify-between'>
          <h1 className='font-black text-4xl'>{nombre}</h1>

      {admin && (

      
      <div className='flex items-center gap-2 text-gray-500 hover:text-black'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>

      <Link to={`/proyectos/editar/${params.id}`} className='uppercase font-bold'>Editar</Link>
      
       </div>
      )}
      </div>

       {admin && (
      <button onClick={handleModalTarea} className='text-sm px-5 py-3 mt-2 w-full md:w-auto rounded-lg uppercase font-bold bg-purple-500 hover:bg-purple-600 text-white text-center flex gap-2 items-center justify-center' 
      type='button'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Nueva Tarea</button>
      )} 

        <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

        <div className='bg-white shadow mt-10 rounded-lg'>
          {proyecto.tareas?.length ? proyecto.tareas?.map(tarea => (
            <Tarea 

            key={tarea._id}
            tarea={tarea}
            />
          )) : <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
        </div>

        {admin && (
           <>
        <div className='flex items-center justify-between mt-10'>
          <p className='font-bold text-xl '>Colaboradores</p>

          <Link className='text-gray-600 hover:text-black uppercase font-bold'
          to={`/proyectos/nuevo-colaborador/${proyecto._id}`}>Añadir</Link>
      
        </div>

      <div className='bg-white shadow mt-10 rounded-lg'>
          {proyecto.colaboladores?.length ? proyecto.colaboladores?.map(colaborador => (
            <Colaborador 

            key={colaborador._id}
            colaborador={colaborador}
            />
          )) : <p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>}
        </div>
        </>
        )}
        

        

        <ModalFormularioTarea  />
        <ModalEliminarTarea/>
        <ModalEliminarColaborador/> 

    </>

    

    

  )
  
}

export default Proyecto
