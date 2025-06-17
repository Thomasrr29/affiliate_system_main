import api from './api';
import type { Sale, CreateSaleData, BonusResponse, SaleWithPagination } from '../types/base';

export const salesService = {
  
  async getAll(limit: number, offset: number): Promise<SaleWithPagination> {
    try {
      const { data } = await api.get<SaleWithPagination>(`/sales?limit=${limit}&offset=${offset}`);
      return data;
    } catch(error){
      console.error('Error fetching sales:', error);
      throw new Error('Failed to fetch sales data');
    }
  },

  async getById(id: number): Promise<Sale> {
    try {
      const { data } = await api.get<Sale>(`/sales/${id}`);
      return data;
    } catch(error){
      console.error('Error fetching sale by ID:', error);
      throw new Error(`Failed to fetch sale with ID ${id}`);
    }
  },

  async create(saleData: CreateSaleData): Promise<Sale> {
    try {
      const { data } = await api.post<Sale>('/sales', saleData);
      return data;
    } catch(error){
      console.error('Error creating sale:', error);
      throw new Error('Failed to create sale');
    }
  },

  async createWithBonus(saleData: CreateSaleData): Promise<BonusResponse> {
    try {
      const { data } = await api.post<BonusResponse>('/sales/with-bonus', saleData);
      return data;
    } catch(error){
      console.error('Error creating sale with bonus:', error);
      throw new Error('Failed to create sale with bonus');
    }
  }
};