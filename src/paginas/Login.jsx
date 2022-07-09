import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
import useAuth from '../hooks/useAuth'

const Login = () => {

const [email, setEmail] = useState('')
const [password, setPassword] = useState('') 
const [alerta, setAlerta] = useState({})

/* Extraccion de elementos que vienen del <Provider></Provider>*/

    const {setAuth} = useAuth()

    const navigate = useNavigate()

/* *********************************************************** */    

    const handleSubmit = async e =>{

      e.preventDefault();

      //validacion del formualrio
      if([ email, password].includes('')) {
        setAlerta({
          msg: 'Todos los campos son obligatorios',
          error: true
        })

        return
    }

    /************ Loguerse  **************/

    try {
      const {data} = await clienteAxios.post('/usuarios/login',{
      email, password
      })
      setAlerta({})
      //guardamos el token en localStorage
      localStorage.setItem('token', data.token)
      setAuth(data)//le pasamos los datos que obtenemos al autenticarnos 
      navigate('/proyectos')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
    

    }

const {msg} = alerta//extraemos lo  que tiene la alerta

  return (
    <>
      <h1 className='text-purple-800 font-black text-6xl capitalize'>Inicia sesión y administra tus {' '} <span className='text-slate-700'> proyectos</span></h1>

      {msg && <Alerta alerta={alerta}/>}

      <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg px-10 p-10'>

          <div className = 'my-5'>
            <label className = 'uppercase text-gray-600 block text-xl font-bold' htmlFor="email">Email:</label>
            <input className='w-full p-3 mt-3 border rounded-xl bg-gray-50' id='email' type="email"  
            placeholder ='Email de registro' value={email} onChange={e => setEmail(e.target.value)}/>
          </div>

          <div className = 'my-5'>
            <label className = 'uppercase text-gray-600 block text-xl font-bold' htmlFor="password">Password:</label>
            <input className='w-full p-3 mt-3 border rounded-xl bg-gray-50' id='password' type="password"  
            placeholder ='Password de registro' value={password} onChange={e => setPassword(e.target.value)}/>
          </div>

          <input type="submit"  value='Iniciar Sesion' className='bg-green-600 hover:bg-green-700 mb-5 hover:cursor-pointer py-3 rounded  text-white uppercase w-full font-bold'/>

      </form>

      <nav className='lg:flex lg:justify-between'>

      <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/registrar" >¿No tienes una cuenta? Registrate</Link>

      <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/olvide-password" >Olvidaste tu contraseña</Link>

      </nav>

    </>
  )
}

export default Login
