import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Download} from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { AllSalesListComponent } from './RenderSalesList';
import LoadingComponent from '../../components/LoadingRow';
import ErrorPageComponent from '../../components/ErrorPage';
import PaginationComponent from '../../components/PaginationComponent';
import { salesService } from '../../services/salesService';
/*
  Funciones sugeridas:
  - Pagination 
  - Define what put in bonus 
  - See function 
  - Total sales, Total Profit, Assets Added
  - fetchSales(filters): Obtener lista de ventas con filtros
  - handleSearch(query): Buscar ventas
  - handleFilterChange(filters): Cambiar filtros
  - handlePageChange(page): Cambiar página
  - exportSales(): Exportar ventas a CSV/Excel
*/

const SalesList: React.FC = () => {
  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const {data, requestError} = useFetch({
    url: '',
    queryFn: () => salesService.getAll(limit, offset)
  })

  const handleOffsetChild = (value: number) => {
    setOffset(value)
  }

  const total = data?.data.length

  if (requestError){return <ErrorPageComponent message={requestError.message}/>}

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
            <p className="text-gray-600 mt-1">Gestiona todas las ventas y transacciones</p>
          </div>
          <Link
            to="/sales/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nueva Venta
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Todos</option>
                <option>Completados</option>
                <option>Pendientes</option>
                <option>Cancelados</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Total Ventas</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{total}</p>
        </div>
      </div>

      {/* Sales Table - transformado a flex/grid pero manteniendo la estructura de llamadas original */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Encabezado de la tabla */}
        <div className="bg-gray-50 grid grid-cols-7 gap-x-2 px-6 py-3 border-b border-gray-200">
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cliente
          </div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Monto
          </div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Afiliado
          </div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tipo cliente
          </div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fecha
          </div>
          <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </div>
        </div>

        {/* Contenido de la tabla - manteniendo tu llamada a componente */}
        <div className="divide-y divide-gray-200">
          {data ? <AllSalesListComponent sales={data.data} /> : <LoadingComponent/> }
        </div>

        {/* Paginación - manteniendo tu llamada a componente */}
        <div className="border-t border-gray-200">
          <PaginationComponent 
            total={total ? total : 0} 
            limit={limit} 
            offset={offset} 
            handleOffset={handleOffsetChild}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesList