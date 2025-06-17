from src import Client, AssetBalance, Wallet #Importing the entities that have circular imports 
from fastapi import FastAPI 
from src.core.db import engine
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from src.api.api_v1 import api_router
from fastapi.middleware.cors import CORSMiddleware
import requests 
# from src.events.callbell_constants import CALLBELL_TOKEN, CALLBELL_BASE_URL

async def create_tables(): 
    async with engine.begin() as conn: 
        await conn.run_sync(SQLModel.metadata.create_all)

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Running aplication and creating tables")

    await create_tables()
    # await verify_callbell_connection()

    yield 

# async def verify_callbell_connection():

#     if not CALLBELL_BASE_URL or not CALLBELL_TOKEN: 
#         print("Credentials for connect with callbell invalid or not available")
#         return 

#     headers = {
#         'Authorization': f'Bearer {CALLBELL_TOKEN}',
#         'Content-Type': 'application/json'
#     }

#     try: 
#         response = requests.get(f'{CALLBELL_BASE_URL}/auth/me', headers=headers)
#         print(f'Sucessfull connection {response} ✅')

#     except Exception as e: 
#         raise(f'Error validating token with callbell {e}')

app = FastAPI(lifespan=lifespan)

origins = [
    "http://127.0.0.1:5173", 
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(api_router, prefix="/api/v1")






