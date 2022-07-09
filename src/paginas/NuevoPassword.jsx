import React from 'react'
import { useState, useEffect } from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const NuevoPassword = () => {

const [password, setPassword] = useState('')//state para el nuevo password que se creara
const [tokenValido, setTokenValido] = useState(false)//este state lo utilizamos para validar el token, si es valido mostramos el formulario y sino no se mostrara
const [alerta, setAlerta] = useState({})
const [passwordModificado, setPasswordModificado] = useState(false)


const params = useParams()
const {token} = params

  useEffect(() => {

  const comprobarToken = async () => {
    try {

     await clienteAxios(`/usuarios/olvide-password/${token}`)
      setTokenValido(true)

    } catch (error) {
      
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      
    }

  }

  comprobarToken()

  }, [])

  /*Funcion para enviar el nuevo password ingresado */

    const handleSubmit = async e => {
      e.preventDefault();
    
      //validacion del formualrio
      if(password.length < 6 ) {
          setAlerta({
            msg: 'El password debe ser minimo de seis caracteres',
            error: true
          })
  
          return
      }

      //reseteando la alerta para quitarla de la pantalla
      setAlerta({})
  
      /************ Enviar solicitud  **************/
  
      try {
        const {data} = await clienteAxios.post(`/usuarios/olvide-password/${token}`,{
          password
        })
        
        setAlerta({
          msg: data.msg,
          error: false
        })
        setPasswordModificado(true)

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    
    }

  const {msg} = alerta //extraemos el mensaje

  return (
    <>
    <h1 className='text-purple-800 font-black text-4xl '>Restablece tu password y no pierdas acceso a tus {' '} <span className='text-slate-700'> proyectos</span></h1>

    {msg && <Alerta alerta= {alerta}/>}

    {tokenValido && (

      <form onSubmit={handleSubmit} className='my-10 bg-white shadow rounded-lg px-10 p-10'>

      <div className = 'my-5'>
        <label className = 'uppercase text-gray-600 block text-xl font-bold' htmlFor="password">Nuevo Password:</label>
        <input className='w-full p-3 mt-3 border rounded-xl bg-gray-50' id='password' type="password"  
        placeholder ='Escribe tu nuevo password' value={password} onChange={e => setPassword(e.target.value)}/>
      </div>

      <input type="submit"  value='Guardar nuevo password' className='bg-green-600 hover:bg-green-700 mb-5 hover:cursor-pointer py-3 rounded  text-white uppercase w-full font-bold'/>

  </form>
    )}

|   {passwordModificado && (
        <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/" >Inicia Sesion en este enlace</Link>
      )}

  </>
  )
}

export default NuevoPassword
