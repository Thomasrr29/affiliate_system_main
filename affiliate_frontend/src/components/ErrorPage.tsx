import React from "react"

interface errorProps {
    message: string 
}

const ErrorPageComponent: React.FC<errorProps> = ({message}) => {

    return (    
        <div className=" flex flex-col text-center h-screen justify-center items-center gap-6 w-full">
            <h3 className="text-4xl text-red-300">Oops! ._. Hemos tenido un error </h3>
            <p className="text-xl text-gray-600 italic">{message}</p>
            <button type="button"
            onClick={() => window.location.reload()} 
            className="text-white bg-red-600 rounded-lg cursor-pointer
            font-semibold py-4 px-6 hover:bg-red-400 duration-400">Volver a intentar</button>
        </div>
    )
}

export default ErrorPageComponent