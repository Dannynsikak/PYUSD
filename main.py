from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
import requests as req
import os
from dotenv import load_dotenv
from database import initialize_db
import asyncio
from datetime import datetime, timedelta, timezone


load_dotenv()

# load API keys from the .env file
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
GPC_RPC_URL = os.getenv("GPC_RPC_URL")
COINGECKO_API_URL = os.getenv("COINGECKO_API_URL")
GECKO_TERMINAL_API_URL = os.getenv("GECKO_TERMINAL_API_URL")

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
    response = req.get(url).json()
    return {"total_supply": response["result"]}


@app.get("/pyusd/gas")
def get_gas_price():
    gas_price = w3.eth.gas_price
    return {"gas_price_gwei": w3.from_wei(gas_price, 'gwei')}

@app.get("/pyusd/transactions")
def get_latest_transactions():
    url = f"https://api.etherscan.io/api?module=account&action=tokentx&contractaddress={PYUSD_CONTRACT}&apikey={ETHERSCAN_API_KEY}"
    response = req.get(url).json()
    
    if "result" not in response:
        return {"error": "Invalid response from Etherscan API"}
    
    # Define the start  2023
    start_of_2023 = datetime(2023, 1, 1, tzinfo=timezone.utc)
    now = datetime.now(timezone.utc) # Get current date and time

    # Filter transactions from 2023 up to date
    transactions_from_2023 = [
        tx for tx in response["result"]
        if "timeStamp" in tx and start_of_2023.timestamp() <= int(tx["timeStamp"]) <= now.timestamp()
    ]

    return transactions_from_2023

@app.get("/pyusd/historical-supply")
def get_historical_supply():
    url = f"https://api.etherscan.io/api?module=stats&action=tokensupplyhistory&contractaddress={PYUSD_CONTRACT}&apikey={ETHERSCAN_API_KEY}"
    response = req.get(url).json()
    return {"historical_supply": response["result"]}

@app.get("/pyusd/balance/{wallet_address}")
def get_wallet_balance(wallet_address: str):
    url = f"https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress={PYUSD_CONTRACT}&address={wallet_address}&tag=latest&apikey={ETHERSCAN_API_KEY}"
    response = req.get(url).json()
    return {"wallet_balance": response["result"]}

@app.get("/pyusd/transaction/{tx_hash}")
def get_transaction_details(tx_hash: str):
    url = f"https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash={tx_hash}&apikey={ETHERSCAN_API_KEY}"
    response = req.get(url).json()
    return response["result"]

def fetch_pyusd_price():
    """Fetch PYUSD price from coinGecko API"""
    try:
        response = req.get(COINGECKO_API_URL)
        data = response.json()
        return data.get("paypal-usd",{}).get("usd", "N/A")
    except Exception as e:
        print(f"Error fetching PYUSD price: {e}")
        return "N/A"
    
@app.get("/pyusd/price")
async def get_pyusd_price():
    """Rest api endpoint to fetch PYUSD price"""
    return {"pyusd_price": fetch_pyusd_price()}

@app.get("/pyusd/market-data")
def get_pyusd_market_data():
    """Fetch PYUSD market data from Gecko Terminal API"""
    try:
        response = req.get(GECKO_TERMINAL_API_URL)
        data = response.json()
        attributes = data.get("data",{}).get("attributes",{})
        return {
            "price": attributes.get("base_token_price_usd", "N/A"),
            "market_cap": attributes.get("market_cap_usd", "N/A"),
            "volume_24h": attributes.get("volume_usd", {}).get("h24", "N/A"),
            "liquidity": attributes.get("reserve_in_usd", "N/A"),
            "fdv": attributes.get("fdv_usd", "N/A"),
        }
    except Exception as e:
        return {"error": str(e)}


@app.get("/pyusd/market-transactions")
def get_recent_transactions():
    """Fetch recent transactions (buy/sell)."""
    try:
        response = req.get(GECKO_TERMINAL_API_URL)
        data = response.json()
        transactions = data.get("data", {}).get("attributes", {}).get("transactions", {}).get("h24",{})

        return {
            "buys": transactions.get("buys", 0),
            "sells": transactions.get("sells", 0),
            "buyers": transactions.get("buyers", 0),
            "sellers": transactions.get("sellers", 0),
        }
    except Exception as e:
        return {"error": str(e)}
    
@app.websocket("/ws/pyusd/price")
async def websocket_pyusd_price(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            pyusd_price = get_pyusd_price()
            await websocket.send_json(pyusd_price)
            await asyncio.sleep(5) # delay to avoid overwhelming the server
    except WebSocketDisconnect:
        print("Websocket connection closed")

@app.websocket("/ws/market-data")
async def websocket_market_data(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            market_data = get_pyusd_market_data()
            await websocket.send_json(market_data)
            await asyncio.sleep(5)  # Add a delay to avoid overwhelming the server
    except WebSocketDisconnect:
        print("WebSocket connection closed")

@app.websocket("/ws/market-transactions")
async def websocket_market_transactions(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            transactions = get_recent_transactions()
            await websocket.send_json(transactions)
            await asyncio.sleep(5)  # Add a delay to avoid overwhelming the server
    except WebSocketDisconnect:
        print("WebSocket connection closed")




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

@app.websocket("/ws/price")
async def websocket_price(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            price = fetch_pyusd_price()
            await websocket.send_json({"pyusd_price": price})
            await asyncio.sleep(5)
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
    uvicorn.run(app, host="0.0.0.0", port=8000, ws_max_size=2**20) # uvicorn main:app --host 0.0.0.0 --port 8000 --reload

