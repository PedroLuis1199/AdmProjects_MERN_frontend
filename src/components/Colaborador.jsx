import React from 'react'
import useProyectos from '../hooks/useProyectos'
const Colaborador = ({colaborador}) => {

    const {handleModalEliminarColaborador} = useProyectos()
    const {nombre, email} = colaborador

  return (
    <div className='border-b p-5 flex justify-between items-center'>

        <div>
            <p>{nombre}</p>
            <p className='text-sm text-gray-700'>{email}</p>
        </div>


        <div>
            <button onClick={() => handleModalEliminarColaborador(colaborador)} className='bg-red-600 hover:bg-red-700 px-4 py-3 text-sm rounded-lg text-white uppercase font-bold'>Eliminar</button>
        </div>
      
    </div>
  )
}

export default Colaborador
