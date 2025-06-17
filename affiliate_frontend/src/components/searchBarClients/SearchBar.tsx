import { useState } from "react"
import ResultsSearchComponent from "./resultsSearch"
import type { Client, ClientType } from "../../types/base"

interface SearchBarProps<T> {
    placeholder: string;
    queryFn: (value: string, client_type: ClientType) => Promise<T>;
    client_type: ClientType;
    onSelectedClient: (client: Client) => void;
}

const SearchBarComponent = <T,> ({placeholder, queryFn, client_type, onSelectedClient}: SearchBarProps<T>) => {


    const [value, setValue] = useState<string>('')

    return ( 

        <div className="relative">
            <div>
                <input
                    type="text"
                    step="210000"
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={placeholder}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            <ResultsSearchComponent onSelectedClient={onSelectedClient} queryFn={queryFn} value={value} client_type={client_type}/>
        </div>
    )
}


export default SearchBarComponent