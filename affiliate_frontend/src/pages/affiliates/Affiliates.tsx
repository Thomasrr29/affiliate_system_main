import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Search, Plus, ArrowUpRight } from 'lucide-react';
import AffiliatesRender from './AffiliatesRender';
import LoadingComponent from '../../components/LoadingRow';
import { ClientService } from '../../services/affiliateServices';
import type { Client } from '../../types/base';
import { useNavigate } from 'react-router-dom';

/*
  Funciones sugeridas:
  - fetchAffiliates(filters): Obtener lista de afiliados
  - searchAffiliates(query): Buscar afiliados
  - updateAffiliateStatus(affiliateId, status): Actualizar estado
  - calculateCommission(affiliateId): Calcular comisiones
  - exportAffiliatesReport(): Exportar reporte
  - openAffiliateDetails(affiliate): Ver detalles
  - copyReferralCode(code): Copiar código
  - createNewAffiliate(data): Crear nuevo afiliado
*/

const Affiliates: React.FC = () => {

  const [clients, setClients] = useState<Client[] | []>([])
  const navigate = useNavigate()

  useEffect(() => {

    const fetchClients = async () => {
        const clients = await ClientService.getAll(20, 0)
        setClients(clients.data)
    }

    fetchClients()
  }, [])

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Afiliados</h1>
            <p className="text-gray-600 mt-1">Gestiona tu red de afiliados y comisiones</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 
          text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => navigate('/affiliates/new')}>
            <Plus size={20} />
            Nuevo Afiliado
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-90">Total Afiliados</span>
            </div>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm opacity-90 mt-2">38 activos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Comisiones Pagadas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$12,450.25</p>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+15.3% este mes</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o código..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Todos los tipos</option>
            <option>Cliente</option>
            <option>Afiliado</option>
            <option>Atleta</option>
            <option>Embajador</option>
          </select>
        </div>
      </div>
      {/* Affiliates List - Sin estructura de tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {clients && clients.length > 0 ? <AffiliatesRender data={clients}/> : <LoadingComponent/>}
      </div>
    </div>    
  );
}

export default Affiliates