import React from 'react'
import { Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import useAuth from '../hooks/useAuth'
import Busqueda from './Busqueda'
const Header = () => {

  const {handleBuscador, buscador, cerrarSesion} = useProyectos()
  const {cerrarSesionAuth} = useAuth()

  //cerrar sesion
  const handleCerrarSesion = () => {
    cerrarSesionAuth()
    cerrarSesion()
    localStorage.removeItem('token')
  }

  return (
    <header className='px-4 py-5 bg-white border-b'>

        <div className='md:flex md:justify-between'>

            <h2  className='text-4xl text-green-600 text-center font-black mb-5 md:mb-0'>AMDProjects</h2>
            
            

            <div className='flex flex-col md:flex-row items-center gap-4'>

            <button onClick={handleBuscador} className='font-bold uppercase' type='button'>Buscar Proyectos</button>

            <Link to='/proyectos' className='font-bold uppercase'> Proyectos </Link>
            <button onClick={handleCerrarSesion} className='text-white text-sm bg-purple-800 hover:bg-purple-900 
            p-3 rounded-md uppercase font-bold' type='button'>Cerrar Sesion</button>

              <Busqueda/>

            </div>

        </div>
  
    </header>
  )
}

export default Header
