import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext()

const AuthProvider = ({children}) =>{

   const [auth, setAuth] = useState({})//state para autenticacion
   const [cargando, setCargando] = useState(true)

   const navigate = useNavigate()

   //efect para comprobar que haya un token
   useEffect(() => {

    const autenticarUsuario = async () =>{

        const token = localStorage.getItem('token')//obtenemos el token que almacenamos al iniciar sesion

        if(!token){
            setCargando(false)
            return
        }

        //Bearer token que necsitamos pasarle al endpoind
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const {data} = await clienteAxios('/usuarios/perfil', config)
            setAuth(data)
            //navigate('proyectos')//su se verifica que esta autenticado, redireccionamos el usuario hacia proyectos .. esta linea es opcional
        } catch (error) {
            setAuth({})//se pone como objeto vacio, por si expira el token, asi lo regresamos a un objeto vacio
            
        }finally{
            setCargando(false)
        }

    }

    autenticarUsuario()

   }, [])

   const cerrarSesionAuth = () => {
    setAuth({})
   }

    return(
        <AuthContext.Provider value={{auth, setAuth, cargando, cerrarSesionAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthProvider}

export default AuthContext