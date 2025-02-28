from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
import requests
import os
from dotenv import load_dotenv
from database import initialize_db
import asyncio

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

@app.get("/pyusd/historical-supply")
def get_historical_supply():
    url = f"https://api.etherscan.io/api?module=stats&action=tokensupplyhistory&contractaddress={PYUSD_CONTRACT}&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url).json()
    return {"historical_supply": response["result"]}

@app.get("/pyusd/balance/{wallet_address}")
def get_wallet_balance(wallet_address: str):
    url = f"https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress={PYUSD_CONTRACT}&address={wallet_address}&tag=latest&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url).json()
    return {"wallet_balance": response["result"]}

@app.get("/pyusd/transaction/{tx_hash}")
def get_transaction_details(tx_hash: str):
    url = f"https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash={tx_hash}&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url).json()
    return response["result"]



@app.websocket("/ws/gas")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            gas_price = w3.eth.gas_price
            await websocket.send_json({
                "gas_price_gwei": str(w3.from_wei(gas_price, 'gwei'))
            })
            await asyncio.sleep(5)  # Add a delay to avoid overwhelming the server
    except WebSocketDisconnect:
        print("WebSocket connection closed")


@app.websocket("/ws/transactions")
async def websocket_transactions(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            latest_tx = get_latest_transactions() # fetch transactions
            await websocket.send_json(latest_tx)
            await asyncio.sleep(5)  # Add a delay to avoid overwhelming the server
    except WebSocketDisconnect:
        print("WebSocket connection closed")


@app.websocket("/ws/supply")
async def websocket_supply(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            latest_supply = get_pyusd_supply() # fetch the latest supply
            await websocket.send_json(latest_supply)
            await asyncio.sleep(5)  # Add a delay to avoid overwhelming the server
    except WebSocketDisconnect:
        print("WebSocket connection closed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, ws_max_size=2**20)
