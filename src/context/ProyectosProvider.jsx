import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";
import {useNavigate} from 'react-router-dom'
import useAuth from "../hooks/useAuth";
import io from 'socket.io-client'

let socket;

const ProyectoContext = createContext()

const ProyectosProvider = ({children}) =>{

    const [proyectos, setProyectos] = useState([])//state para la obtencion de todos los proeyctos
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})//state para la obtencion de un unico proyecto
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false) //state para el modal de edicion
    const [tarea, setTarea] = useState({})//state de tareas y usado para edicion
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false) //state para el modaal de eliminar tareas
    const [buscador, setBuscador] = useState(false)
   
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)//state  para el modal de colaboradores
    const [colaborador, setColaborador] = useState({}) 

    const navigate = useNavigate()// variable de navigate para la redirrecion
    const {auth} = useAuth()

    useEffect(() =>{

        const obtenerProyectos = async () =>{

            try {
                
                const token = localStorage.getItem('token')
                if(!token) return
        
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:`Bearer ${token}`
                    }
                }
        
                const {data} = await clienteAxios('/proyectos', config)
                setProyectos(data)
                setAlerta({})

            } catch (error) {
                console.log(error)
            }
        }

        obtenerProyectos()

    }, [auth])

    //conexion a socket
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])


//Funcion para la alerta
    const mostrarAlerta = alerta =>{
        setAlerta(alerta)

        setTimeout(() =>{
            setAlerta({})
        }, 5000)
    }

//Funcion para recibir los datos del proyecto que vienen de FormularioProyecto
    const submitProyecto = async proyecto => {

        if(proyecto.id){
           await editarProyecto(proyecto)
        } else{
           await nuevoProyecto(proyecto)
        }

    }

/*Edicion de Proyectos */

    const editarProyecto = async proyecto => {

        try {
            
            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

        const {data} = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
        console.log(data)

        //Sincronizar el state
        const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
        setProyectos(proyectosActualizados)

        //Alerta
        setAlerta({
            msg: 'Proyecto actualizado correctamente',
            error: false
        })  

        //Redirrecion hacia la pagina de proyectos luego de haber editado el proyecto
        setTimeout(() => {
            setAlerta({})
            navigate('/proyectos')
            
        }, 3000);

        } catch (error) {
            console.log(error)
        }

    }

/*Creacion de Proyectos */

    const nuevoProyecto = async proyecto => {

        try {
            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }
    
            const {data} = await clienteAxios.post('/proyectos', proyecto, config)
            setProyectos([...proyectos, data])//actualizar el state para que este sincronizado el mostrar proyectos con  la creacion
    
            setAlerta({
                msg: 'Proyecto creado correctamente',
                error: false
            })  
    
            //Redirrecion hacia la pagina de proyectos luego de haber creado el proyecto
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
                
            }, 3000);
    
        } catch (error) {
            console.log(error)
        }

    }

    const obtenerProyecto = async id =>{

        setCargando(true)

        try {

            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

            const {data} = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            
        } catch (error) { 
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true 
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000);
        }finally{
            setCargando(false)
        }
    }

    /* Eliminar Proyectos */

    const eliminarProyecto = async  id => {

        try {

            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
         
            //Sincronizara el state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            //Alerta que se muestra
            setAlerta({
                msg: 'Proyecto eliminado',
                error: true
            })  

            //Redireccion despues de eliminar
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
                
            }, 1000);
    
        } catch (error) {
            console.log(error)
        }
    }
    
    /*Modal para mostrar o ocultar el modal*/
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    //Funcion para evaluar si existe id, si es asi se llama editarTarea, sino crearTarea

    const submitTarea = async tarea => {

        if(tarea?.id){
           await editarTarea(tarea)
        }else{
            await crearTarea(tarea)
        }

       

    }

    const crearTarea = async tarea => {

        try {

            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }
    
            const {data} = await clienteAxios.post('/tareas', tarea, config)   
            //agrega la tarea al state
            /*const proyectoActualizado= {...proyecto}
            proyectoActualizado.tareas = [...proyecto.tareas, data]
            setProyecto(proyectoActualizado)*/
            
            setAlerta({})
            setModalFormularioTarea(false)

            //SOCKET IO
            //pasar tarea al backend
            socket.emit('nueva tarea', data)

            
        } catch (error) {
            console.log(error)
        }

    }  

    const editarTarea = async tarea => {

        try {
            
            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

        const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
        console.log(data)

        //Sincronizar el state
        /*const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
        setProyecto(proyectoActualizado)*/

        //Alerta
        setAlerta({
            msg: 'Tarea actualizado correctamente',
            error: false
        })  

        setAlerta({})
        setModalFormularioTarea(false)

        //Socket
        socket.emit('actualizar tarea', data)

        } catch (error) {
            console.log(error)
        }

    }

    const handleModalEditarTarea = tarea => {

        setTarea(tarea)
        setModalFormularioTarea(true)

    }

    const handleModalEliminarTarea = tarea =>{
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        
        try {
            
            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

        const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

            setAlerta({
                msg: data.msg,
                error: false
            })
       
        /*const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id )
        setProyecto(proyectoActualizado)*/

        setModalEliminarTarea(false)//cerrar modal despues de eliminar
        //quitar la alerta de la eliminacion de la tarea despues de 3 segundos
       
        //socket
        socket.emit('eliminar tarea', tarea)


        setTarea({})//limpiar el objeto de tarea
        setTimeout(()=> {
            setAlerta({})
        }, 3000)


        } catch (error) {
            console.log(error)
        }

    }

    //Funcion para buscar y agregar coloboradoes

    const submitColaborador = async email => {

        setCargando(true)

        try {

            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)//le pasamos lo que se envio al state
            setAlerta({})//limpiar alerta


        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error : true
            })
        }finally{
            setCargando(false)
        }
        
    } 

    const agregarColaborador = async email => {

        try {

            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            
                setAlerta({
                    msg: data.msg,
                    error: false
                })
    
            //resetaer el objeto
            setColaborador({})

            setTimeout(() => {
                setAlerta({ })
            }, 2000);
            navigate(`/proyectos/${proyecto._id}`)
            
        } catch (error) {
            console.log(error.response)
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        
        }
        
    }

    const handleModalEliminarColaborador = (colaborador) =>{
        
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
        }

    const eliminarColaborador = async  () => {
 
        try {

            const token = localStorage.getItem('token')
            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

            //sincronizar el state despues de eliminar colaborador
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboladores = proyectoActualizado.colaboladores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({ })
            }, 2000);
            
            
        } catch (error) {

            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        
        }


    }

    const completarTarea = async id => {

    try {

      const token = localStorage.getItem('token')
       if(!token) return
    
        const config = {
         headers: {
         "Content-Type": "application/json",
         Authorization:`Bearer ${token}`
                }
         }

         const {data} = await clienteAxios.post(`/tareas/estado/${id}`,{}, config)


         //Actualizar el state
         /*const proyectoActualizado = {...proyecto}
         proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
            tareaState._id === data._id ? data : tareaState )
         setProyecto(proyectoActualizado)*/

         setTarea({})
         setAlerta({})

         //socket 
         socket.emit('cambiar estado', data)
            
        } catch (error) {
            console.log(error.response)
        }

    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //Socket io
    const submitTareasProyecto = (tarea) => {
        //Actualizar el state de las tareas del lado del colaborador 
        const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
            setProyecto(proyectoActualizado) 
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id )
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = {...proyecto}
         proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
            tareaState._id === tarea._id ? tarea : tareaState )
         setProyecto(proyectoActualizado)
    }

    const cerrarSesion = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return(
        <ProyectoContext.Provider value={{proyectos, mostrarAlerta, alerta, submitProyecto, obtenerProyecto, 
         proyecto, cargando, eliminarProyecto, modalFormularioTarea, handleModalTarea, submitTarea, handleModalEditarTarea, tarea,
         handleModalEliminarTarea, modalEliminarTarea, eliminarTarea, submitColaborador, colaborador, agregarColaborador,
         handleModalEliminarColaborador, modalEliminarColaborador, eliminarColaborador, completarTarea,
         buscador, handleBuscador, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea,
         cerrarSesion }}>
            {children}
        </ProyectoContext.Provider>
    )
}

export { ProyectosProvider }

export default ProyectoContext