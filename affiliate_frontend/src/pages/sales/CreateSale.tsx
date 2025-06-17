import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, Save, X } from 'lucide-react';
import SearchBarComponent from '../../components/searchBarClients/SearchBar';
import { ClientService } from '../../services/affiliateServices';
import type { Client } from '../../types/base';
import ClientSelectedComponent from './ClientSelected';

/*
  Funciones sugeridas:
  - handleSubmit(data): Enviar formulario
  - validateForm(): Validar campos
  - calculateBonus(amount, type): Calcular bono basado en tipo
  - calculateAffiliateCommission(amount, affiliateId): Calcular comisión
  - fetchClients(): Cargar lista de clientes
  - fetchAffiliates(): Cargar lista de afiliados
  - updatePreview(): Actualizar vista previa en tiempo real
*/


interface FormDataSale {

  client: Client | null
  affiliate: Client | null 
  amount: number
  reference_id: ''

}

const CreateSale: React.FC = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataSale>({
    client: null,
    affiliate: null,
    amount: 0,
    reference_id: ''
  })

  console.log(formData)

  /*WE CREATE TWO STATES CAUSE we would need use a param and we cant use the state params in this component */

  const [error, setError] = useState<string | null>(null)

  /*WE SHARE THE STATE WITH THE GRANDCHILDS FOR RECEIVE THE CLIENT SELECTED */
  const handleSelectedClient = (client: Client | null) => {
      setFormData((prev) => ({
        ...prev,
        client
      }))
  }

  const handleAffiliateClient = (client: Client | null) => {
    setFormData((pepe) => ({
      ...pepe,
      affiliate: client
    }))
  }


const handleSubmit = (e: React.FormEvent) => {

  e.preventDefault()

  console.log("DATOS FINALES", formData)

}
  


  return (
    <div className="p-8 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Nueva Venta</h1>
          <p className="text-gray-600 mt-1">Registra una nueva venta y aplica bonos automáticamente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {error && <p className='text-red-500 font-semibold text-lg'>{error}</p>}
          {/* Form */}
          <form
          onSubmit={handleSubmit}
          className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Información de la Venta</h2>
              </div>
              
              <div className="flex flex-col gap-4 p-6 space-y-6">
                {/* Client */}
                <div className='my-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Cliente
                  </label>
                  {
                    !formData.client ? 
                  <SearchBarComponent 
                    placeholder='Ingresa el nombre o email' 
                    queryFn={ClientService.getByMultipleParams}
                    client_type={'CLIENT'}
                    onSelectedClient={handleSelectedClient}
                  /> : <ClientSelectedComponent 
                  setClientClosing={() => setFormData((prev) => ({...prev, client: null}))}
                  client={formData.client} 
                  role='Cliente'/>
                  }
                </div>

                {/* Affiliate */}
                <div className='my-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Afiliado (opcional)
                  </label>
                  {
                    !formData.affiliate ? 
                    <SearchBarComponent 
                      placeholder='Ingresa el nombre o email' 
                      queryFn={ClientService.getByMultipleParams} 
                      client_type={'AFFILIATE'}
                      onSelectedClient={handleAffiliateClient}
                    /> : <ClientSelectedComponent 
                    setClientClosing={() => setFormData((prev) => ({...prev, affiliate: null}))}
                    client={formData.affiliate} 
                    role='Afiliado'/>
                  }
                  
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Monto
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      onChange={(e) => setFormData((prev) => ({...prev, amount: parseFloat(e.target.value) | 0}))}
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Reference ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Referencia (opcional): 
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingresa el ID de la venta: "
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <button 
                  type='submit'
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 
                  text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    <Save className="w-5 h-5" />
                    Crear Venta
                  </button>
                  <button
                    onClick={() => navigate('/sales')}
                    className="flex-1 flex items-center justify-center gap-2 
                    bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Resumen</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Monto de Venta</p>
                  <p className="text-2xl font-bold text-gray-900">${formData.amount}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Bono Aplicado (puntos)</p>
                  <p className="text-xl font-semibold text-green-600">{formData.amount * 0.1}</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Comisión Afiliado</p>
                  <p className="text-lg font-semibold text-purple-600">$0.00</p>
                </div>

                {/* Desglose Visual */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-3">DESGLOSE</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Venta Base</span>
                      <span className="font-medium">${formData.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bono</span>
                      <span className="font-medium text-green-600">{formData.amount * 0.1}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Comisión</span>
                      <span className="font-medium text-purple-600">$0.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSale