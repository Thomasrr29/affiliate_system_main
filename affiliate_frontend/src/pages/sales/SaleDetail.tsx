import React from 'react';
import type { AssetTransactionCategory, AssetType, Sale } from '../../types/base';
import { useFetch } from '../../hooks/useFetch';
import { AssetsService } from '../../services/assetsServices';
import LoadingComponent from '../../components/LoadingRow';
/*
  Funciones sugeridas:
  - fetchSaleDetail(id): Obtener detalles de la venta
  - handleStatusUpdate(newStatus): Actualizar estado de la venta
  - sendReceipt(): Enviar recibo al cliente
  - generateInvoice(): Generar factura
  - cancelSale(): Cancelar venta
  - fetchTransactionTimeline(saleId): Obtener línea de tiempo
*/

interface SaleDetailProps {
  sale: Sale | null;
}

interface Transaction {
    wallet_id: number
    amount: number
    description: string
    asset_type: AssetType
    category: AssetTransactionCategory
    reference_id: number
    updated_at: Date
    created_at: Date
}

const SaleDetail = React.memo<SaleDetailProps>(({sale}) => {

    if (!sale) {
        return <div className="w-full p-6 text-center">No hay información de venta disponible</div>;
    }

    /*THE REFERENCE ID IS USED IN THE TRANSACTIONS IN AND OUT, AFFILIATE AND CLIENT */
    const {data, isLoading, requestError} = useFetch({
        url: '',
        queryFn: () => AssetsService.GetAssetTransactionsByReferenceId(sale.id),
        enabled: Boolean(sale)
    })

    if(isLoading) return <LoadingComponent/>

    const transactions = data || [];

  return (
      <div className="w-[800px] flex justify-center items-center p-10">
          <div className="w-full">
              <div className="bg-white">
                  <div className="flex justify-around mx-6 bg-blue-500 rounded-lg p-4 shadow-sm">
                      <div className='w-1/2'>
                          <p className="text-white text-4xl font-semibold">{sale?.buyer_client.name}</p>
                          <ul className='list-none text-blue-900 font-medium'>
                              <li>{sale?.buyer_client.email}</li>
                              <li>{sale?.buyer_client.phone}</li>
                              <li>{sale?.buyer_client.client_type}</li>
                          </ul>
                      </div>
                      {sale?.refering_affiliate ? (
                          <div className='w-1/2'>
                              <p className="text-white text-4xl font-semibold">{sale?.refering_affiliate.name}</p>
                              <ul className='list-none text-blue-900 font-medium'>
                                  <li>{sale?.refering_affiliate.email}</li>
                                  <li>{sale?.refering_affiliate.phone}</li>
                                  <li>{sale?.refering_affiliate.client_type}</li>
                              </ul>
                          </div>

                      ) : <p className='w-1/2 text-white font-semibold text-lg p-6 rounded-lg'>Sin afiliado</p>}

                  </div>
                  <div className='w-full mt-4'>
                    <p className='mx-6 text-lg text-gray-700 font-semibold '>Transactions</p>
                    <section className=" rounded-lg mx-6">
                        {
                            transactions && transactions.length > 0 ? (
                                transactions.map((transaction: Transaction) => (
                                    <div key={transaction.wallet_id} className={`${transaction.category == "IN" ? "bg-green-100" : "bg-red-100"} 
                                    grid grid-cols-5 grid-rows-2 my-2 gap-y-4
                                    px-6 py-4 border-b border-gray-200 rounded-lg`}>
                                        <p className="text-sm font-medium text-gray-700 col-span-5">{transaction.description}</p>
                                        <div>
                                            <p className="text-xs text-gray-500">SALE ID: {transaction.reference_id}</p>
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">
                                            {transaction.amount}
                                        </span>
                                        <span className="text-sm">
                                            <p className='text-blue-500 font-medium'>{transaction.asset_type}</p>
                                        </span>
                                        <div>
                                            <span className="">
                                                {transaction.category == "IN" ? (
                                                    <p className="text-sm font-medium text-blue-500">{transaction.category}</p>
                                                ) : <p className="text-sm font-medium text-gray-900">{transaction.category}</p>}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(transaction.created_at).toLocaleDateString('es-ES')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="p-6 text-gray-500">No hay transacciones disponibles</p>
                            ) 
                        }
                    </section>

                  </div>  
              </div>
          </div>
      </div> 
  )
    
})

export default SaleDetail 