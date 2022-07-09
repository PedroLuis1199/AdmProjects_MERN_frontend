
import {Link} from 'react-router-dom'
import { useState } from 'react'
import Alerta from '../components/Alerta'
import axios from 'axios'
import clienteAxios from '../config/clienteAxios'

const Registrar = () => {

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [alerta, setAlerta] =useState({})//state para errores
  

  //Funcion para el envio de la informacion
  const handleSubmit = async e => {
    e.preventDefault();
    
    //validacion del formualrio
    if([nombre, email, password, repetirPassword].includes('')) {
        setAlerta({
          msg: 'Todos los campos son obligatorios',
          error: true
        })

        return
    }

    //validacion de passwords para que sean iguales
    if(password !==  repetirPassword){
      setAlerta({
        msg: 'Los passwords no coinciden',
        error: true
      })

      return
    }

    //validacion tamaño password
    if(password.length < 6 ){
      setAlerta({
        msg: 'El Password muy corto, agrega minimo seis caracteres',
        error: true
      })

      return
    }

    //reseteando la alerta para quitarla de la pantalla
    setAlerta({})

    /************ Crear usuario en la API  **************/

    try {
      const {data} = await clienteAxios.post(`/usuarios`,{
        nombre, email, password
      })
      
      setAlerta({
        msg: data.msg,
        error: false
      })

      //Limpiar el formulario
      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')

    } catch (error) {
      console.log(error.response.data.msg)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  
  }

const {msg} = alerta//extraemos lo  que tiene la alerta

  return (
    <>
    <h1 className='text-purple-800 font-black text-6xl capitalize'>Registrate y administra tus {' '} <span className='text-slate-700'> proyectos</span></h1>

      {msg && <Alerta alerta={alerta}/>}

    <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg px-10 p-10'>

    <div className = 'my-5'>
          <label className = 'uppercase text-gray-600 block text-xl font-bold' htmlFor="nombre">Nombre:</label>
          <input className='w-full p-3 mt-3 border rounded-xl bg-gray-50' id='nombre' type="text"  
           placeholder ='Ingrese su nombre' value={nombre} onChange={e => setNombre(e.target.value)}/>
        </div>

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

        <div className = 'my-5'>
          <label className = 'uppercase text-gray-600 block text-xl font-bold' htmlFor="confirmar_password">Confirmar Password:</label>
          <input className='w-full p-3 mt-3 border rounded-xl bg-gray-50' id='confirmar_password' type="password" 
           placeholder ='Ingrese nuevamente el password' value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)}/>
        </div>

        <input type="submit"  value='Crear Cuenta' className='bg-green-600 hover:bg-green-700 mb-5 hover:cursor-pointer py-3 rounded  text-white uppercase w-full font-bold'/>

    </form>

    <nav className='lg:flex lg:justify-between'>
 
    <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/" >¿Ya tienes una cuenta? Inicia Sesion</Link>

    <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/olvide-password" >Olvidaste tu contraseña</Link>

    </nav>

  </>
  )
}

export default Registrar
