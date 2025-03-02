import requests

def get_pyusd_price_kraken():
    url = "https://api.kraken.com/0/public/Ticker?pair=PYUSDUSD"
    
    try:
        response = requests.get(url).json()
        return {"pyusd_price": response["result"]["PYUSDUSD"]["c"][0]}
    except KeyError:
        return {"pyusd_price": "N/A"}
    except requests.exceptions.ConnectionError:
        return {"pyusd_price": "Connection error"}

print(get_pyusd_price_kraken())
