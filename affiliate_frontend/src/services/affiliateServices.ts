import type {Client, ClientType, ClientWithPagination, CreateClientData } from '../types/base';
import api from './api'

interface ClientCreationResponse {

    data: {
        client: Client,
        wallet: any 
    }
}

export const ClientService = {

    getAll: async (limit: number, offset: number): Promise<ClientWithPagination> => {

        try {   
            const { data } = await api.get<ClientWithPagination>(`/clients?limit=${limit}&offset=${offset}`)
            return data;
        } catch (error){
            console.error('Error fetching affiliates:', error);
            throw new Error('Failed to fetch affiliates data');
        }

    },


    create: async (clientData: CreateClientData): Promise<ClientCreationResponse> => {
        try {

            const { data } = await api.post<ClientCreationResponse>('/clients/create', clientData)
            return data; 

        } catch(error){
            console.error('Error fetching affiliates:', error);
            throw new Error('Failed creating new client');
        }
    },

    getByMultipleParams: async(value: string, client_type: ClientType): Promise<[Client]> => {

        try {

            const { data } = await api.get<[Client]>(`/clients/get/multiple/${value}?type=${client_type}`)
            return data

        } catch(error){
            console.error('Error fetching affiliates:', error);
            throw new Error(`${error}`);
        }

    }





}