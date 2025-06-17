import api from "./api"

export const AssetsService = {

    GetAssetTransactionsByReferenceId: async (sale_id: number) => {

        try {
            
            const { data } = await api.get(`assets/transactions/reference_id/${sale_id}`)
            return data
    
        } catch(error){

            console.error('Error creating sale:', error);
            throw new Error('Failed to create sale');
            
        }
    } 

}