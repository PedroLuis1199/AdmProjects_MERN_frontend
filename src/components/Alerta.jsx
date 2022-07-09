import React from 'react'

const Alerta = ({alerta}) => {
  return (
    <div className={`${alerta.error ? 'bg-red-500' : 'bg-sky-600'}
    bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}>
      {alerta.msg}
    </div>
  )
}

export default Alerta
