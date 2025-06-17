import { Eye, Edit, Copy} from 'lucide-react';
import type { Client} from '../../types/base';
import type React from 'react';

interface AffiliatesRenderProps{
  data: Client[] | []
}


const AffiliatesRender: React.FC<AffiliatesRenderProps> = ({data}) => {

  function modifyDate(date: string){

    return date.slice(0, 10) as String
  }

  const client_data = data || []
  
  return (
    <div className="space-y-3">
      {/* Header - Solo visible en desktop */}
      <div className="hidden lg:grid lg:grid-cols-6 justify-around gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div>Afiliado</div>
        <div>Código</div>
        <div>Nivel</div>
        <div>Celular</div>
        <div>Desde</div>
        <div>Acciones</div>
      </div>

      {/* Lista de clientes */}
      <div className="space-y-2">
        {client_data && client_data.map((client: Client) => (
          <div 
            key={client.id} 
            className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            {/* Layout para Desktop (Grid) */}
            <div className="hidden lg:grid lg:grid-cols-6 gap-4 items-center p-6">
              {/* Afiliado */}
              <div>
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                <p className="text-xs text-gray-500">{client.email}</p>
              </div>

              {/* Código */}
              <div className="flex items-center">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{client.affiliate_code}</code>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Nivel */}
              <div>
                <p>{client.client_type}</p>
              </div>

              {/* Celular */}
              <div>
                <span className="text-sm font-medium text-gray-900">{client.phone}</span>
              </div>

              {/* Fecha creación */}
              <div>
                <p className="text-xs text-gray-500">{modifyDate(client.created_at.toString())}</p>
              </div>


              {/* Acciones */}
              <div className="flex items-center gap-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Layout para Mobile/Tablet (Flexbox) */}
            <div className="lg:hidden p-4 space-y-4">
              {/* Header del cliente */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.email}</p>
                  <p className="text-sm text-gray-700 mt-1">{client.client_type}</p>
                </div>
                
                {/* Acciones móvil */}
                <div className="flex items-center gap-2 ml-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Código de afiliado */}
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{client.affiliate_code}</code>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Métricas en filas */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Comisión:</span>
                  <span className="text-sm font-medium text-gray-900">%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Referencias:</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{20}</p>
                    <p className="text-xs text-gray-500">{10} activos</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Ganancias:</span>
                  <span className="text-sm font-medium text-green-600">${(500).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Conversión:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{15 * 2}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${15 * 2}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AffiliatesRender