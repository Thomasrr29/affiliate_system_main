
/*SALE*/

interface ClientInSales {
    name: string
    email: string
    phone: string
    client_type: ClientType
    id: number
}

export interface SaleWithPagination {
  limit: number,
  offset: number,
  data: Sale[]
}

export interface Sale {
  id: number
  total_amount: number 
  sale_date: Date
  reference_sale_id: number | null  
  buyer_client_id: number 
  refering_affiliate_id: number | null 
  buyer_client: ClientInSales 
  refering_affiliate: ClientInSales | null 
}

export interface CreateSaleData {
  buyer_client_id: number;
  data: {
    amount: number;
  };
  AssetTypeForSale: AssetType;
  BonusTypeForSale: BonusType;
  refering_affiliate_id?: number | null;
}

/*WALLET AND ASSETS */
export interface Wallet {
  id: string;
  client_id: number;
  balance: number;
  currency: string;
  points: number;
}

export interface BonusResponse {
  CLIENT: {
    wallet_id: string;
    amount: number;
    bonus_type: BonusType;
  };
  AFFILIATE: {
    wallet_id: string;
    amount: number;
    bonus_type: 'AFFILIATE';
  } | null;
}

export type AssetType = "POINTS" | "MONEY";
export type BonusType = 'STANDARD' | 'PREMIUM' | 'VIP' | 'AFFILIATE';
export type AssetTransactionCategory = "IN" | "OUT"

/*AFFILIATES */

export type ClientType = "CLIENT" | "AFFILIATE" | "ATHLETE" | "AMBASSADOR";

export interface ClientWithPagination {
  limit: number,
  offset: number,
  data: Client[]
}

export interface Client {
    id: number
    client_id: string
    name: string
    email: string
    phone: string  
    client_type: ClientType
    affiliate_code: string 
    updated_at: Date
    created_at: Date
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  client_type: ClientType
}


/*
get clients 
get affiliate_clients 
get client by client type 
 {
    "client_id": "1234",
    "phone": "3107856758",
    "affiliate_code": null,
    "created_at": "2025-04-22T13:16:52.126000Z",
    "name": "Thomas",
    "email": "thomasrr29@gmail.com",
    "client_type": "CLIENT",
    "updated_at": "2025-04-22T13:16:52.126000Z",
    "id": 1
  },

get client ID
get affiliate by affiliate code 
{
  "client_id": "1234",
  "phone": "3107856758",
  "affiliate_code": null,
  "created_at": "2025-04-22T13:16:52.126000Z",
  "name": "Thomas",
  "email": "thomasrr29@gmail.com",
  "client_type": "CLIENT",
  "updated_at": "2025-04-22T13:16:52.126000Z",
  "id": 1,
  "wallet": {
    "client_id": 1,
    "updated_at": "2025-04-22T13:17:16.074688Z",
    "id": 1,
    "created_at": "2025-04-22T13:17:16.074687Z"
  }
}






*/