import { Eye } from 'lucide-react';
import type {Sale} from '../../types/base';
import ModalComponent from '../../components/ModalComponent';
import { useState } from 'react';
import SaleDetail from './SaleDetail';

interface SaleListProps {
    sales: Sale[]
}

export const AllSalesListComponent: React.FC<SaleListProps> = ({sales}) => {

    /*MAPPED SALES*/  

    const [saleSelected, setSaleSelected] = useState<Sale | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openDetails = (sale: Sale) => {

      setSaleSelected(sale)
      setIsOpen(true)

    }

    const formatDate = (dateString: Date) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString('es-ES', options);
    }
    
    const sale_data = sales
    console.log(sale_data)

    return (
        <div className="w-full">
            {sale_data && sale_data.map((sale: Sale, index: number) => (
              <div key={sale.id} className="grid grid-cols-7 gap-2 px-6 py-4 hover:bg-gray-50 border-b border-gray-200">
                <div className="text-sm text-gray-900">
                  #{index}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{sale.buyer_client.name}</p>
                  <p className="text-xs text-gray-500">ID: {sale.buyer_client.id}</p>
                </div>
                <div className="text-sm text-gray-900">
                  ${sale.total_amount}
                </div>
                <div className="text-sm">
                  {
                    sale.refering_affiliate ? (
                      <p className='text-blue-500 font-medium'>{sale.refering_affiliate.name}</p> 
                    ) : (
                      <p className='text-gray-500 font-medium'>Sin afiliado</p>
                    )
                  }
                  <p className={`${sale.refering_affiliate ? "flex text-xs text-gray-500" : "hidden"}`}>ID: {sale.refering_affiliate_id}</p>
                </div>
                <div>
                  <span className={""}>
                    {sale.buyer_client.client_type === "CLIENT" ? (
                      <p className="text-sm font-medium text-blue-500">{sale.buyer_client.client_type}</p>
                    ) : <p className="text-sm font-medium text-gray-900">{sale.buyer_client.client_type}</p>}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(sale.sale_date)}
                </div>
                <div className="text-sm font-medium">
                  <button
                    className='cursor-pointer flex items-center gap-1' 
                    onClick={() => openDetails(sale)}>
                    <Eye size={16}/>
                    Detalles
                  </button>
                </div>
              </div>
            ))}
            <ModalComponent 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <SaleDetail sale={saleSelected}/>
        </ModalComponent>
        </div>
        
    )
}