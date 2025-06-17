import { useEffect, useState } from "react"
import LoadingComponent from "../LoadingRow"
import type { Client, ClientType } from "../../types/base"
import ErrorPageComponent from "../ErrorPage"

interface ResultsSearchProps<T> {
    queryFn: (value: string, client_type: ClientType ) => Promise<T>,
    value: string 
    client_type: ClientType
    onSelectedClient: (client: Client) => void
}


const ResultsSearchComponent = <T,> ({queryFn, value, client_type, onSelectedClient}: ResultsSearchProps<T>) => {

    const MIN_QUERY_LENGTH = 2 
    const DELAY = 800 

    const [data, setData] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<any | null>(null)


    useEffect(() => {


        if(value.length <= MIN_QUERY_LENGTH){

            setIsLoading(false)
            setData([])
            return; 
        }

        setIsLoading(true)


        const timeoutSearch = setTimeout( async () => {

            try {

                const result = await queryFn( value, client_type )
                setData(result)

            } catch(error){

                console.error(`There was a problem in the request ${error}`)
                setError(error)
                setData([])

            } finally {

                setIsLoading(false)

            }

        }, DELAY)


        return () => clearTimeout(timeoutSearch)

    }, [value, queryFn])

    if(value == '') return null; 

    if(error) return <ErrorPageComponent message={error}/>

    if(isLoading) return <LoadingComponent/>

    return (
        <div className="absolute w-full bg-white z-10 rounded-lg">
            {
                data && data.length > 0 ? (
                    data.map((client: Client) => (    
                        <div key={client.id} 
                        className="py-2 
                        font-normal text-gray-400 cursor-pointer 
                        hover:bg-blue-600 px-6 rounded-lg group"
                        onClick={() => onSelectedClient(client)}>
                            <section className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-blue-600 group-hover:text-white">{client.name}</p>
                                    <p className="group-hover:text-blue-200">{client.email}</p>
                                    <p className="group-hover:text-blue-200">{client.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 group-hover:text-white font-bold">{client.client_type}</p>
                                </div>
                            </section>
                            <hr className="text-gray-300 group-hover:text-blue-200 my-2"/>
                        </div>
                        
                    ))
                ) : (
                    <p className="text-gray-500 font-semibold p-2"> No hay resultados disponibles </p>
                )
            }
        </div>
    )
}


export default ResultsSearchComponent