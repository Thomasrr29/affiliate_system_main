from fastapi import HTTPException
from typing import Optional
from src.events import CALLBELL_TOKEN, CALLBELL_CHANNEL_UUID, CALLBELL_BASE_URL
import httpx 

headers = {
    'Authorization': f'Bearer {CALLBELL_TOKEN}',
    'Content-Type': 'application/json'
}

class contentType: 
    text: str 

class SendMessageContent: 

    to: str
    from_: str
    type: str
    channel: str
    content: contentType

class CallbellServices: 

    def __init__(self, api_key, url_base):

        self.api_key = api_key
        self.url_base = url_base
        self.client: Optional[httpx.AsyncClient] = None 

    #We need add this methods for that this class be valid for the async context manager 
    async def __aenter__(self): 

        self.client = httpx.AsyncClient(
            headers=headers,
            timeout=30.0,
            base_url=self.url_base
        )

        return self 

    async def __aexit__(self, exc_type, exc_val, exc_tb): 
        if self.client: 
            await self.client.aclose()

    async def welcomeMessage(self, client): 

        #WE RECEIVE THE CLIENT OBJECT SO WE NEED ACCESS WITH []
        message = f'BIENVENIDO {client['name']} A ESSENTIAL, NOS ALEGRA QUE HAGAS PARTE DE ESTA COMUNIDAD✌️\n'
        return await self.sendMessagesWithContent(client['phone'], message)
    
    async def paymentReminderMessage(self, client, amount: float): 

        message = f'HOLA! {client['name']} te escribimos para recordarte tu próximo pago del monto de {amount}'
        return await self.sendMessagesWithContent(client['phone'], message)

    async def sendMessagesWithContent(self, phone:str, text: str):

        try: 

            response = await self.client.post(
                '/messages/send', 
                json = {
                    'to': phone,
                    'from': 'whatsapp',
                    'type': 'text',
                    'channel': CALLBELL_CHANNEL_UUID,
                    'content': {'text': text}
                }
            )
            response.raise_for_status()
            return response.json()

        except httpx.HTTPStatusError as e: 

            raise HTTPException(detail=f'Exception sending the message {e.response.status_code} {e.response}')

        except httpx.TimeoutException: 

            raise TimeoutError(f'API error timeout exception')
        
        except Exception as e: 

            raise Exception(f'Unexpected error: {e}')

async def get_callbell_service(): 

        async with CallbellServices(
            api_key=CALLBELL_TOKEN,
            url_base=CALLBELL_BASE_URL
        ) as service: 
            yield service 








         