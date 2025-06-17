from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from .models import SalesCreate, SalesUpdate, Sales, SalesWithBonusData
from src.assets.bonus_services import BonusService
from src.wallets import WalletsService
from sqlmodel import select
from fastapi import HTTPException, status
from src.assets.enums import AssetType, BonusType

class SalesService(): 

    async def get_all_sales(db: AsyncSession, limit: int = 10, offset: int = 0): 
        
        try: 

            result = await db.execute(
            select(Sales)
            .limit(limit)
            .offset(offset)
            .options(
                selectinload(Sales.buyer_client), 
                selectinload(Sales.refering_affiliate)
            ))
            db_sales = result.scalars().all()

            for sale in db_sales: 
                print(f"Sale id: {sale.id}")
                print(f"client buyer{sale.buyer_client}")
                print(f"Refering client {sale.refering_affiliate}")

            return {
                "limit": limit,
                "offset": offset, 
                "data": db_sales,
            }
            

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Exception getting the sales {e}") 
        
    async def GetSiigoLastSales(db: AsyncSession): 
        print("Get siigo sales created after the last date registered")

    async def ValidateSiigoSaleExistence():
        print("Siigo sale existence validated") 

    async def CreateSale(db: AsyncSession, createSaleData: SalesWithBonusData) -> Sales:

        ####IN OTHER SERVICE WITH TRANSACTION 
        try: 

            sale_dict = createSaleData.model_dump(exclude={"AssetTypeForSale", "BonusTypeForSale", "data"})
            sale_data = Sales(**sale_dict)

            db.add(sale_data)
            await db.flush()

            return sale_data


        except Exception as e: 

            print("❌ ERROR AL CREAR SALE:", str(e))
            raise

    ###CREATE SERVICE THAT APPLY BONUS 
    async def CreateSaleAndApplyBonusWallet(db:AsyncSession, createSaleData: SalesWithBonusData): 
        
        ##THE PARENT SERVICE WITH THE SESSION FOR TRANSACTION CREATED 
        async with db.begin(): 

            try: 

                buyer_wallet = await WalletsService.GetWalletByClientId(db, createSaleData.buyer_client_id)

                affiliate_wallet = None

                if createSaleData.refering_affiliate_id: 

                    affiliate_wallet = await WalletsService.GetWalletByClientId(db, createSaleData.refering_affiliate_id)

                #We create the sale 
                sale_created: Sales = await SalesService.CreateSale(db, createSaleData)

                buyer_bonus_data = {
                    "amount": createSaleData.total_amount,
                    "sale_id": sale_created.id
                }
                
                affiliate_bonus_data = {
                    "amount": createSaleData.total_amount,
                    "sale_id": sale_created.id
                } if affiliate_wallet else None 

                bonus_client_result = await BonusService.apply_bonus(
                    db=db,
                    wallet_id=buyer_wallet['id'],
                    AssetType=createSaleData.AssetTypeForSale,
                    bonus_type=createSaleData.BonusTypeForSale,
                    data=buyer_bonus_data
                )

                bonus_affiliate_result = None 
                if affiliate_wallet: 

                    bonus_affiliate_result = await BonusService.apply_bonus(
                        db=db,
                        wallet_id=affiliate_wallet['id'],
                        AssetType=AssetType.POINTS,
                        bonus_type=BonusType.AFFILIATE,
                        data=affiliate_bonus_data
                    )
                

                #We verify if the sale has a refering affiliate id and apply the bonus to the affiliate wallet
                

                return {
                    "success": True,
                    "sale": {
                        "id": sale_created.id,
                        "total_amount": sale_created.total_amount,
                        "buyer_client_id": sale_created.buyer_client_id,
                        "refering_affiliate_id": sale_created.refering_affiliate_id
                    },
                    "CLIENT": bonus_client_result,
                    "AFFILIATE": bonus_affiliate_result
                }
            
            except HTTPException:
                # ✅ Re-raise HTTPExceptions sin modificar
                print("❌ HTTP Exception occurred, rolling back...")
                raise
            except Exception as e:
                # ✅ Manejo de errores inesperados
                print(f"❌ Unexpected error: {str(e)}")
                raise HTTPException(
                    status_code=500, 
                    detail=f"Error creating sale with bonuses: {str(e)}"
                )

    async def GetSalesByClientId(db:AsyncSession, client_id: int):        
        
        result = await db.execute(select(Sales).where(Sales.buyer_client_id == client_id))
        db_client = result.scalars().all()

        if not db_client: 
            raise HTTPException(status_code=404, detail=f'Client wasnt found with the id: {client_id}')

        return db_client

    async def GetSalesByAffilate(db:AsyncSession, affiliate_id: str): 
        
        result = await db.execute(select(Sales).where(Sales.refering_affiliate_id == affiliate_id))
        db_sales = result.scalars().all()

        return db_sales
    
    async def UpdateSale(db:AsyncSession, sale_id: int, updateSaleData: SalesUpdate): 
        
        db_sale = await db.get(Sales, sale_id)

        if not db_sale: 
            raise HTTPException(status_code=404, detail=f'Movement wasnt found with the id: {sale_id}')

        sale_data = updateSaleData.model_dump(exclude_unset=True)

        for key,value in sale_data.items(): 

            setattr(db_sale, key, value)

        db.add(db_sale)
        await db.commit()
        await db.refresh(db_sale)

        return db_sale

    async def DeleteSale(db:AsyncSession, sale_id: int):
        
        db_sale = await db.get(Sales, sale_id)

        if not db_sale: 
            raise HTTPException(status_code=404, detail=f'Movement wasnt found with the id: {sale_id}')
        
        await db.delete(db_sale)
        await db.commit()

        return db_sale