from fastapi import FastAPI
from web3 import Web3
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# load API keys from the .env file
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
GPC_RPC_URL = os.getenv("GPC_RPC_URL")

# connect to ethereum 
w3 = Web3(Web3.HTTPProvider(GPC_RPC_URL))

app = FastAPI()

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
    return response["result"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
