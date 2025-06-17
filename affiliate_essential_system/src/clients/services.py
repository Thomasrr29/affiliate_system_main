from .models import ClientCreate, ClientUpdate, Client
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.wallets.services import WalletsService
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status, BackgroundTasks
from .enums import ClientType
from sqlmodel import select, or_
from src.events.callbell_services import CallbellServices
from src.events.callbell_constants import CALLBELL_CHANNEL_UUID
import logging 
import time


logger = logging.getLogger(__name__)

###
# SERVICES WITHIN TRANSACTIONS PROCESS (TRANSACTIONS OF A LOT PROCESS WITH A SAME SESSION)
# CreateClient 
# ###

class ClientService(): 

    async def GetClientsWithoutPagination(db: AsyncSession): 

        result = await db.get(Client)
        return result 

    async def GetClients(db:AsyncSession, limit: int = 10, offset: int = 0):

        result = await db.execute(
            select(Client)
            .limit(limit)
            .offset(offset))
        db_clients = result.scalars().all()

        if not db_clients:
            raise HTTPException(status_code=404, detail="Clients not found")

        return { 

            "limit": limit, 
            "offset": offset,
            "data": db_clients
        }
    
    async def GetClientByMultipleQuerys(db: AsyncSession, value: str, client_type: str): 

        query = select(Client).where(
            or_(
                Client.name.icontains(value),
                Client.email.icontains(value)
            )
        ).order_by(Client.name)

        if client_type != 'CLIENT':

            query = query.where(Client.client_type != 'CLIENT')
        
        result = await db.execute(query)
        clients = result.scalars().all()
        return clients
        
    async def GetAffiliateClients(db:AsyncSession): 
        
        result = await db.execute(select(Client).where(Client.client_type == ClientType.AFFILIATE))
        db_affiliate_clients = result.scalars().all()

        if not db_affiliate_clients: 
            raise HTTPException(status_code=404, detail="Affiliate clients not found")

        return db_affiliate_clients

    async def GetClientById(client_id: int, db: AsyncSession): 
        
        result = await db.execute(
            select(Client)
            .where(Client.id == client_id)
            .options(selectinload(Client.wallet))
        )
        db_client = result.scalar_one_or_none()
            

        if not db_client: 
            raise HTTPException(status_code=404, detail=f'Client not found by the id: {client_id}')

        client_dict = jsonable_encoder(db_client)

        if db_client.wallet:
            
            #We add the relation data maually
            client_dict["wallet"] = jsonable_encoder(db_client.wallet) 

            #We delete the client relation in wallet for avoid circular import
            if "client" in client_dict["wallet"]: 

                del client_dict["wallet"]["client"]
        
        return client_dict
          
    async def GetClientByAffiliateCode(db:AsyncSession , affiliateCode:str): 
        
        result = await db.execute(
            select(Client)
            .where(Client.affiliate_code == affiliateCode)
            .options(selectinload(Client.wallet)))
        db_client = result.scalar_one_or_none()

        if not db_client: 
            raise HTTPException(status_code=404, detail=f'Client not found with the Affiliate code: {affiliateCode}')
        
        client_dict = jsonable_encoder(db_client)
        
        if db_client.wallet: 

            client_dict["wallet"] = jsonable_encoder(db_client.wallet)

            if "client" in client_dict["wallet"]: 
                del client_dict["wallet"]["client"]

        return client_dict

    async def GetClientsByClientType(clientType: ClientType, db:AsyncSession,):
        
        result = await db.execute(select(Client).where(Client.client_type == clientType))
        client = result.scalars().all()

        if not client: 
            raise HTTPException(status_code=404, detail=f'Clients not found with the client type: {clientType}')

        return client

    def GenerateAffiliateCode(name: str): 
        
        # Generate a unique affiliate code based on the client's name
        return f"{name[:3].upper()}-{int(time.time())}"
          
    async def CreateClient(db: AsyncSession, createClientData: ClientCreate): 
        
        print("DATA FOR CREATE CLIENT", createClientData)

        client_create = Client.model_validate(createClientData)

        print("DATA FOR CREATE CLIENT", client_create)
        
        db.add(client_create)
        await db.flush()
        await db.refresh(client_create)

        return jsonable_encoder(client_create, exclude="wallet")

    async def createClientWithValidationsAndWallet(
            db: AsyncSession, 
            createClientData: ClientCreate,
    ):

        async with db.begin():

            try: 
                result = await db.execute(select(Client).where(Client.email == createClientData.email))
                client_existence = result.scalar_one_or_none()

                if client_existence: 
                    raise HTTPException(status_code=401, detail=f'The client with the email {createClientData.email} already exists')

                
                # Generate affiliate code if the client type is affiliate
                if createClientData.client_type != ClientType.CLIENT:
                    createClientData.affiliate_code = ClientService.GenerateAffiliateCode(createClientData.name)

                # Create the client
                created_client = await ClientService.CreateClient(db, createClientData)
                
                wallet_create = await WalletsService.CreateWalletWithBalances(db, created_client['id'])
                
                return {
                        "client": created_client,
                        "wallet": wallet_create
                    }
                
                
            except HTTPException:
                # ✅ Re-raise HTTPExceptions (validaciones de negocio)
                raise
                
            except IntegrityError as e:
                # ✅ Errores de BD específicos (unique constraints, foreign keys)
                logger.error(f"Database integrity error creating client: {str(e)}")
                if "email" in str(e).lower():
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Client with this email already exists"
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Data validation error"
                    )
                
            except SQLAlchemyError as e:
                # ✅ Otros errores de BD
                logger.error(f"Database error creating client: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Database error occurred while creating client"
                )
                
            except Exception as e:
                # ✅ Errores inesperados
                logger.error(f"Unexpected error creating client: {str(e)}", exc_info=True)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="An unexpected error occurred while creating the client"
                )
            
    async def UpdateClient(db: AsyncSession, client_id: int, updateClientData: ClientUpdate): 
       
        client_db = await db.get(Client, client_id)

        if not client_db: 
            raise HTTPException(status_code=404, detail="The client wasnt found with the id: {client_id}")

        client_data = updateClientData.model_dump(exclude_unset=True)

        for key, value in client_data.items(): 
            setattr(client_db, key, value)

        db.add(client_db)
        await db.commit()
        await db.refresh(client_db)

        return client_db

    async def DeleteClient(client_id: int, db: AsyncSession): 

        client = await db.get(Client, client_id)

        if not client: 
            raise HTTPException(status_code=404, detail=f'Client not found with the id: {client_id}')

        await db.delete(client)
        await db.commit()

        return client 