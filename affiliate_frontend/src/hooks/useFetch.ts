import { useEffect, useState } from "react"

interface useFetchProps<T> {
    data: T | null; 
    isLoading: boolean; 
    requestError: Error | null; 
    cancel: () => void; 
    // refetch: () => void; 
}

export const useFetch = <T = any> ({
    url,
    queryFn,
    enabled = true, /*A VARIABLE THAT DEFINE IF THE 
    COMPONENTS IS READY FOR EXECUTE */
    deps = [] /*THE FUNCTIONS DEPENDS OF THIS VARIABLES FOR EXECUTE */
     
}: {
    url: string, 
    queryFn: () => Promise<T>,
    enabled?: boolean,
    deps?: any[]
}): useFetchProps<T> => {

    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [requestError, setRequestError] = useState<any>(null)
    const [newAbortController, setNewAbortController] = useState<any>(null)

    useEffect(() => {

        if(!enabled) return; 

        const controller = new AbortController(); 

        setNewAbortController(controller)
        setIsLoading(true)
        setRequestError(null)

        const fetchData = async () => {

            try {

                let result; 

                if(queryFn){

                    result = await queryFn();

                } else if (url){

                    const response = await fetch(
                        url, {
                            method: "GET",
                            signal: controller.signal,
                            headers: {"Content-Type": "application/json"}
                        }
                    ); 

                    result = await response.json(); 
                }

                setData(result)

            } catch(error: any){
                if (error.name !== "AbortError"){
                    setRequestError(error)
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()

        return () => controller.abort(); 
        
    }, [url, enabled, ...deps])

    const handleCancelRequest = () => {
        if(newAbortController){
            newAbortController.abort();
        }
        setRequestError("Request cancelled")
    }
    
    return {data, isLoading, requestError, cancel: handleCancelRequest};
}
