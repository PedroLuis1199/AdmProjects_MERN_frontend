
import { useEffect, useState } from 'react'
import axios from 'axios'
import {useParams, Link} from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

const ConfirmarCuenta = () => {

  const [alerta, setAlerta] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

const params = useParams()//esto es para extraer el id que viene por la url
const {id} = params//tomamos el id que viene por la url

useEffect(() => {

  //Codigo para confirmar la cuenta via token
  const confirmarCuenta = async () =>{

    try {
      const url = `/usuarios/confirmar/${id}`
      const { data } = await clienteAxios(url)
      
      //mostrando mensaje en caso de confirmacion existosa
      setAlerta({
        msg: data.msg,
        error: false
            
      })

    setCuentaConfirmada(true)

    } catch (error) {
      //usando un state para el error
     /* setAlerta({
        msg: error.response.data.msg,
        error: true
      })*/
    }

  }

  confirmarCuenta();

}, [])

//componente de alerta
const {msg} = alerta

  return (
    <>

    <h1 className='text-purple-800 font-black text-4xl '>Confirma tu cuenta y empieza a crear tus {' '} <span className='text-slate-700'> proyectos</span></h1>

    <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
      
      {msg && <Alerta alerta= {alerta}/>}

      {cuentaConfirmada && (
        <Link className='block text-center my-4 text-slate-500 uppercase text-sm' to="/" >Inicia Sesion en este enlace</Link>
      )}
    </div>
    </>
  )
}

export default ConfirmarCuenta
