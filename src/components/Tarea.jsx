import React from 'react'
import {formatearFecha} from '../helpers/formatearFecha'
import useProyectos from '../hooks/useProyectos'
import useAdmin from '../hooks/useAdmin'

const Tarea = ({tarea}) => {

    const {handleModalEditarTarea,handleModalEliminarTarea, completarTarea} = useProyectos()

    const {descripcion, nombre, prioridad, _id, fechaEntrega, estado} = tarea

    const admin = useAdmin()

  return (
    <div className='border-b p-5 flex  justify-between items-center'>

        <div className='flex flex-col items-start'>
            <p className='mb-2 text-xl'>{nombre}</p>
            <p className='mb-2 text-sm text-gray-500 uppercase'>{descripcion}</p>
            <p className='mb-2 text-xl'>{formatearFecha(fechaEntrega)}</p>
            <p className='mb-2 text-gray-600'>Prioridad: {prioridad}</p>  
            {estado && <p className='text-xs bg-green-600 uppercase p-1 rounded-lg text-white'> Completada por: {tarea.completado.nombre} </p>}
            
        </div>

        <div className='flex flex-col lg:flex-row gap-4'>

            {admin && (
                <button onClick={() => handleModalEditarTarea(tarea)} className='bg-yellow-700 hover:bg-yellow-800 px-4 py-3 text-sm rounded-lg text-white uppercase font-bold'>Editar</button>
            )}

            <button title='Cambiar estado de la tarea' onClick={() => completarTarea(_id)} className={`${estado ? 'bg-indigo-600 hover:bg-indigo-700'  : 'bg-slate-500 hover:bg-slate-600'}   px-4 py-3 text-sm rounded-lg text-white uppercase font-bold`}>{estado ?'Completa' : 'Imcompleta'}</button>

            {admin && (
                <button onClick={() => handleModalEliminarTarea(tarea)} className='bg-red-600 hover:bg-red-700 px-4 py-3 text-sm rounded-lg text-white uppercase font-bold'>Eliminar</button>
            )}
            
        </div>
        
    </div>
  )
}

export default Tarea
