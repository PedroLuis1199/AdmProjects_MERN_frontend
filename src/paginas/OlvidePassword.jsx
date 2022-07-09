import React from 'react'
import { useState } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'


const OlvidePassword = () => {

const [email, setEmail] = useState('')
const [alerta, setAlerta] = useState({})

  //Funcion para el envio de la informacion
  const handleSubmit = async e => {
    e.preventDefault();
    
    //validacion del formualrio
    if(email === '' || email.length < 6 ) {
        setAlerta({
          msg: 'El email es obligatorio',
          error: true
        })

        return
    }


    //reseteando la alerta para quitarla de la pantalla
    setAlerta({})

    /************ Enviar solicitud  **************/

    try {
      const {data} = await clienteAxios.post(`/usuarios/olvide-password`,{
        email
      })
      
      setAlerta({
        msg: data.msg,
        error: false
      })

      //Limpiar el formulario
      setEmail('')

    } catch (error) {
      console.log(error.response.data.msg)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  
  }
  const {msg} = alerta
  return (
    <>
    <h1 className='text-purple-800 font-black text-6xl capitalize'>Recupera tu acceso y no pierdas tus {' '} <span className='text-slate-700'> proyectos</span></h1>

    {msg && <Alerta alerta={alerta}/>}

    <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg px-10 p-10'>

        <div className = 'my-5'>
          <label className = 'uppercase text-gray-600 block text-xl font-bold' htmlFor="email">Email:</label>
          <input className='w-full p-3 mt-3 border rounded-xl bg-gray-50' id='email' type="email"  
          placeholder ='Ingrese su email de registro ' value={email} onChange={e => setEmail(e.target.value)}/>
        </div>

        <input type="submit"  value='Enviar instrucciones' className='bg-green-600 hover:bg-green-700 mb-5 hover:cursor-pointer py-3 rounded  text-white uppercase w-full font-bold'/>

    </form>

    <nav className='lg:flex lg:justify-between'>

    <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/" >¿Ya tienes una cuenta? Inicia Sesion</Link>


    <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/registrar" >¿No tienes una cuenta? Registrate</Link>

</nav>

  </>
  )
}

export default OlvidePassword
