import React from 'react'
import { useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'


const FormularioColaborador = () => {

  const [email, setEmail ] = useState('')

  //extracion de elementos del provider
  const {mostrarAlerta, alerta, submitColaborador} = useProyectos()

  const handleSubmit = e => {

    e.preventDefault();

    if(email === ''){

      mostrarAlerta({
        msg: 'Debe ingresar el correo para realizar la busqueda',
        error: true
    })

    return
      
    }

    submitColaborador(email)
  }

  

  const {msg} = alerta;

  return (

    <form onSubmit =  {handleSubmit} className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'>

      
      {msg && <Alerta alerta={alerta}/> }

      
      <div className='mb-5'>
      
        <label className='text-gray-700 uppercase font-bold text-sm ' htmlFor="email">Email Colaborador:</label>
        <input className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
         type="email" id='email' placeholder='Email del colaborador' value={email} onChange={e => setEmail(e.target.value)}/>

     </div>

     <input className='bg-green-700 hover:bg-green-800 w-full text-white p-3 rounded uppercase cursor-pointer font-bold'
      type="submit"  value='Buscar colaborador'/>

    </form>

  )
}

export default FormularioColaborador
