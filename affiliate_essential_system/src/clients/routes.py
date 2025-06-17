from fastapi import APIRouter, Query, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .models import ClientCreate, ClientUpdate
from src.types.response_type import ClientsPaginationResponse
from src.events.callbell_services import CallbellServices, get_callbell_service
from fastapi import BackgroundTasks
from .services import ClientService
from src.core.db import get_db
from .enums import ClientType


router = APIRouter()

@router.get('/clients',
    response_model=ClientsPaginationResponse,
    tags=['Clients'],
    summary='Get all clients')
async def getAllClients(db: AsyncSession = Depends(get_db), limit: int = Query(20, ge=1), offset: int = Query(0, ge=0)):

    return await ClientService.GetClients(db, limit, offset)

@router.get('/clients/client-id/{client_id}',
    response_model=None,
    tags=['Clients'],
    summary='Get one client by id')
async def getClientByClientId(client_id: int, db: AsyncSession = Depends(get_db)):

    return await ClientService.GetClientById(client_id, db)

@router.get('/clients/affiliates',
    tags=['Clients'],
    summary='Get all affiliated clients')
async def getAffiliateClients(db: AsyncSession = Depends(get_db)):

    return await ClientService.GetAffiliateClients(db)

@router.get('/clients/affiliate-code/{affiliate_code}',
    tags=['Clients'],
    summary='Get client by affiliate code')
async def getClientByAffiliateCode(affiliate_code: str, db: AsyncSession = Depends(get_db)):

    return await ClientService.GetClientByAffiliateCode(db, affiliate_code)

@router.get('/clients/get/multiple/{value}', 
    tags=['Clients'],
    summary='Get client by name or email property')
async def getClientByMultipleProperties(value: str, type: str = Query('CLIENT'), db: AsyncSession = Depends(get_db)):

    return await ClientService.GetClientByMultipleQuerys(db, value, type)

@router.get('/clients/client-type/{clientType}',
    tags=['Clients'],
    summary='Get clients by a client type')
async def getClientByClientType(clientType: ClientType, db: AsyncSession = Depends(get_db)):

    return await ClientService.GetClientsByClientType(clientType, db)

@router.post('/clients/create',
    tags=['Clients'],
    summary='Create a new client')
async def createClient(db: AsyncSession = Depends(get_db),
                       callbell_service: CallbellServices = Depends(get_callbell_service), 
                       createClient: ClientCreate = Body()):

    created_client = await ClientService.createClientWithValidationsAndWallet(db, createClient)

    try: 
        response = await callbell_service.welcomeMessage(created_client['client'])

    except Exception as e:

        raise Exception(f'Was a problem sending the callbell message {e}') 

    return {
        'client': created_client,
        'response': response
    }

@router.get('/clients/generate-affiliate-code/{name}',
    tags=['Clients'],
    summary='Generate a new affiliate code')
def generateAffiliateCode(name: str):

    """
    Generate a new affiliate code based on the client's name.
    """
    return ClientService.GenerateAffiliateCode(name)

@router.patch('/clients/update/{client_id}',
    tags=['Clients'],
    summary='Update clients')
async def updateClient(client_id: int, db: AsyncSession = Depends(get_db) ,updateClient: ClientUpdate = Body()):
    
    return await ClientService.UpdateClient(db, client_id, updateClient)

@router.delete('/clients/delete/{client_id}',
    tags=['Clients'],
    summary='Delete client by id')
async def deleteClient(client_id: int, db: AsyncSession = Depends(get_db)):
    
    return await ClientService.DeleteClient(client_id, db)