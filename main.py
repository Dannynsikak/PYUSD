from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
import requests
import os
from dotenv import load_dotenv
from database import initialize_db

load_dotenv()

# load API keys from the .env file
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
GPC_RPC_URL = os.getenv("GPC_RPC_URL")

# connect to ethereum 
w3 = Web3(Web3.HTTPProvider(GPC_RPC_URL))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*","http://localhost:3000"],  # Allow all origins (or specify allowed domains)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# database connection 
initialize_db()

PYUSD_CONTRACT = os.getenv('PYUSD_CONTRACT')

@app.get("/pyusd/supply")
def get_pyusd_supply():
    url = f"https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress={PYUSD_CONTRACT}&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url).json()
    return {"total_supply": response["result"]}


@app.get("/pyusd/gas")
def get_gas_price():
    gas_price = w3.eth.gas_price
    return {"gas_price_gwei": w3.from_wei(gas_price, 'gwei')}

@app.get("/pyusd/transactions")
def get_latest_transactions():
    url = f"https://api.etherscan.io/api?module=account&action=tokentx&contractaddress={PYUSD_CONTRACT}&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url).json()
    return response["result"][:100]


@app.websocket("/ws/gas")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        gas_price = w3.eth.gas_price
        await websocket.send_json({
            "gas_price_gwei": str(w3.from_wei(gas_price, 'gwei'))
        })

@app.websocket("/ws/transactions")
async def websocket_transactions(websocket: WebSocket):
    await websocket.accept()
    while True:
        latest_tx = get_latest_transactions() # fetch transactions
        await websocket.send_json(latest_tx)

@app.websocket("/ws/supply")
async def websocket_supply(websocket: WebSocket):
    await websocket.accept()
    while True:
        latest_supply = get_pyusd_supply() # fetch the latest supply
        await websocket.send_json(latest_supply)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, ws_max_size=2**20)
