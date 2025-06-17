import type React from "react"
import type { Client } from "../../types/base"

interface ClientSelectedProps {
    setClientClosing: () => void; 
    client: Client
    role: string 
}

const ClientSelectedComponent: React.FC<ClientSelectedProps> = ({client, role, setClientClosing}) => {


    return (
        <div className="relative font-semibold bg-blue-600 rounded-lg p-4 text-white">
            <button 
            className="absolute px-2 top-0 right-0 cursor-pointer text-lg font-bold"
            onClick={setClientClosing}
            >x</button>
            <p className="text-xl">{role} seleccionado: </p>
            <h3>{client.name}</h3>
            <p>{client.email}</p>
            <p>{client.phone}</p>
        </div>
    )
}


export default ClientSelectedComponent