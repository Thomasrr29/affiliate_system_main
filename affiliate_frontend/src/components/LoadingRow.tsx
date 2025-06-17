const LoadingComponent  = () => {

    return (
        <div className="flex w-full justify-center items-center py-4">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-30" cx="12" cy="12" r="10" stroke="skyblue" strokeWidth="4" />
                <path className="opacity-75" fill="skyblue" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-semibold text-gray-600">Cargando...</span>
            
        </div>
    )
}

export default LoadingComponent