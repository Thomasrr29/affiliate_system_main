from typing import Optional
from typing import Dict, Any
from datetime import datetime 
from src.clients.models import Client
from sqlalchemy import Column, DateTime, String
from sqlmodel import SQLModel, Field, Relationship
from src.common.datetime_function import get_utc_now_function
from src.assets.enums import AssetType, BonusType, CalculateBonusAmount

class ProductsData: 
     name: str
     price: float
     sku: str

class SalesBase(SQLModel):

     total_amount: float 
     sale_date: datetime = Field(
          sa_column=Column(DateTime(timezone=True), nullable=False),
          default_factory=get_utc_now_function)
     reference_sale_id: Optional[str] = None #REFERENCE ID FOR THE SALE IN THE PLATFORM EXTERNAL
     buyer_client_id: int = Field(foreign_key='client.id')
     refering_affiliate_id: Optional[int] = Field(default=None, foreign_key='client.id', nullable=True) 

class Sales(SalesBase, table=True): 
     
     __tablename__ = 'sales'

     id: Optional[int] = Field(default=None, primary_key=True)
     buyer_client:Optional['Client'] = Relationship(
          sa_relationship_kwargs={
               "foreign_keys": "[Sales.buyer_client_id]",
               "lazy": "select"
          }
     )
     refering_affiliate: Optional['Client'] = Relationship(
          sa_relationship_kwargs={
               "foreign_keys": "[Sales.refering_affiliate_id]",
               "lazy": "select"
          }
     )

class SalesCreate(SalesBase):
     
     pass 

class SalesWithBonusData(SalesBase):

     AssetTypeForSale: AssetType = Field(sa_column=Column(String, nullable=False))
     BonusTypeForSale: BonusType = Field(sa_column=Column(String, nullable=False))

class SalesUpdate(SQLModel):
     
     reference_sale_id: Optional[str] = None
     buyer_client_id: Optional[str] = None 
     refering_affiliate_id: Optional[str] = None
     total_amount: Optional[float] = None


