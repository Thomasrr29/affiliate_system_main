import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationComponentProps {
    total: number 
    limit: number
    offset: number
    handleOffset: (value: any) => void
}


const PaginationComponent: React.FC<PaginationComponentProps> = ({total, offset, handleOffset}) => {

    const handlePagination = (page: number) => {
        const newOffsetValue = page * offset 
        handleOffset(newOffsetValue)

    }


    function getPages(total: number, limit: number = 10){

        if(!total) return []
        const pages = Math.ceil(total / limit) 
        return Array.from({length: pages}, (_, i) => i + 1) 
   
    }

    const number_pages = getPages(total)
 
    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">x</span> de {' '}
                <span className="font-medium">x</span> resultados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {number_pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePagination}
                  className={`px-3 py-1 text-sm rounded-md ${
                    page === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
    )
}


export default PaginationComponent