from src.assets.models.transaction import AssetTransaction, AssetTransactionCreate, AssetTransactionUpdate
from src.assets.models.balance import AssetBalance, AssetBalanceCreate
from sqlalchemy.ext.asyncio import AsyncSession
from src.assets.enums import AssetType
from datetime import datetime 
from fastapi import HTTPException
from sqlmodel import select


###
# SERVICES WITHIN TRANSACTIONS PROCESS 
# create_asset_balance
# update_asset_balance_with_new_calculation
# create_asset_transaction
# ###

class AssetsService(): 


    ###IN OTHER SERVICE WITH TRANSACTION APPLIED 
    async def apply_transaction_and_update_balance(
        db: AsyncSession,
        wallet_id: int,
        asset_type: AssetType,
        amount: float,
        category: str,
        description: str,
        reference_id: int = None       
    ):

        transaction_data = AssetTransaction(
            wallet_id=wallet_id,
            asset_type=asset_type,
            amount=amount,
            category=category,
            description=description,
            reference_id=reference_id
        )

        db.add(transaction_data)
        await db.flush()


        balance_change = amount if category == 'IN' else -amount

        balance = await AssetsService.get_or_create_balance(db, wallet_id, asset_type)

        balance.balance += balance_change 
        balance.updated_at = datetime.now()

        await db.flush()

        return {
            "transaction_id": transaction_data.id,
            "new_balance": balance.balance,
            "amount_applied": amount,
            "balance_change": balance_change
        }

    #TRANSACTIONS 
    async def create_asset_transaction(db: AsyncSession, create_asset_transaction: AssetTransactionCreate):

        ###IN OTHER SERVICE WITH TRANSACTION APPLIED 
        asset_transaction_data = AssetTransaction.model_validate(create_asset_transaction)

        db.add(asset_transaction_data)
        await db.flush()
        await db.refresh(asset_transaction_data)

        print("Asset transaction data", asset_transaction_data)
        return asset_transaction_data
 
    async def get_asset_transactions_by_wallet_id(db: AsyncSession, wallet_id: int): 

        result = await db.execute(select(AssetTransaction).where(AssetTransaction.wallet_id == wallet_id))
        db_asset_transactions = result.scalars().all()

        if not db_asset_transactions:
            raise HTTPException(status_code=404, detail="Asset transactions not found")
        
        return db_asset_transactions

    async def get_wallet_transactions_by_asset_type(db: AsyncSession, wallet_id: int, asset_type: str): 
        
        result = await db.execute(select(AssetTransaction).where(
            (AssetTransaction.wallet_id == wallet_id) & 
            (AssetTransaction.asset_type == asset_type)))
        db_assets_transaction = result.scalars().all()

        if not db_assets_transaction: 

            raise HTTPException(status_code=404, detail="Asset transactions not found")
        
        return db_assets_transaction

    async def get_asset_transactions_by_reference_id(db: AsyncSession, reference_id: int):
        result = await db.execute(select(AssetTransaction).where(AssetTransaction.reference_id == reference_id))
        db_asset_transactions = result.scalars().all()

        if not db_asset_transactions: 
            raise HTTPException(status_code=404, detail="Asset transactions not found")
        
        return db_asset_transactions

    #BALANCES 

    async def get_or_create_balance(db: AsyncSession, wallet_id: int, asset_type: AssetType):
        
        balance = await AssetsService.get_asset_balance_by_wallet_id_and_asset_type(db, wallet_id, asset_type)

        if not balance: 

            balance = AssetBalance(
                wallet_id=wallet_id,
                asset_type=asset_type,
                balance=0
            )

            db.add(balance)
            await db.flush()

        return balance 

    async def get_asset_balance_by_wallet_id_and_asset_type(db: AsyncSession, wallet_id: int, asset_type: str): 

        result = await db.execute(select(AssetBalance).where(
            (AssetBalance.wallet_id == wallet_id) & 
            (AssetBalance.asset_type == asset_type)))
        db_asset_balance = result.scalar_one_or_none()

        if not db_asset_balance: 
            raise HTTPException(status_code=404, detail="Asset balance not found")
        
        return db_asset_balance

    async def get_asset_balance_by_wallet_id(db: AsyncSession, wallet_id: int):

        result = await db.execute(select(AssetBalance).where(AssetBalance.wallet_id == wallet_id))
        db_asset_balance = result.scalars().all()

        if not db_asset_balance: 
            raise HTTPException(status_code=404, detail="Asset balance not found")
        
        return db_asset_balance

    async def create_asset_balance(db: AsyncSession, create_asset_balance: AssetBalanceCreate): 

        ###IN OTHER SERVICE WITH TRANSACTION APPLIED 

        #We need to create a new asset balance for the wallet
        result = await db.execute(select(AssetBalance).where(AssetBalance.wallet_id == create_asset_balance['wallet_id']))
        db_asset_balance = result.scalars().all()
        
        #Verify that the wallet doesnt have the same asset type, cause the wallet can only have one asset balance for asset type
        same_asset_balance = [asset_balance for asset_balance in db_asset_balance if asset_balance.asset_type == create_asset_balance['asset_type']]

        if same_asset_balance: 
            raise HTTPException(status_code=400, detail="Asset balance already exists for this wallet and asset type")
        
        #Here we create a pydantic mapped object with the data validated 
        create_asset_balance_data = AssetBalance.model_validate(create_asset_balance)

        db.add(create_asset_balance_data)
        await db.flush()
        await db.refresh(create_asset_balance_data)

        return create_asset_balance

    async def recalculate_asset_balance(db: AsyncSession, wallet_id: int, asset_type: str):

        acum = 0

        asset_transactions = await AssetsService.get_wallet_transactions_by_asset_type(db, wallet_id, asset_type)
        asset_balance = await AssetsService.get_asset_balance_by_wallet_id_and_asset_type(db, wallet_id, asset_type)

        for transaction in asset_transactions: 

            if transaction.category == "IN": 
                acum += transaction.amount
            elif transaction.category == "OUT": 
                acum -= transaction.amount
            else: 
                raise HTTPException(status_code=400, detail="Transaction category not valid")
            
        asset_balance_updated = await AssetsService.update_asset_balance_with_new_calculation(db, asset_balance.id, acum)

        return asset_balance_updated

    ##UPDATE CHANGING THE BALANCE VALUE
    ##This function is used when we need to update the balance of an asset balance, for example when we recalculate the balance
    async def update_asset_balance_with_new_calculation(db: AsyncSession, asset_balance_id: int, total: int):

        db_asset_balance = await db.get(AssetBalance, asset_balance_id)

        if not db_asset_balance: 
            raise HTTPException(status_code=404, detail="Asset balance not found")

        db_asset_balance.balance = total 
        
        db.add(db_asset_balance)
        await db.flush()

        return db_asset_balance        