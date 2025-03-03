import asyncio
import websockets
import json
import pandas as pd
import mplfinance as mpf
from datetime import datetime

# WebSocket API URL
WS_URL = "ws://localhost:8000/ws/market-data"  # Replace with actual URL

# Data storage
market_data_list = []

async def fetch_market_data():
    global market_data_list
    async with websockets.connect(WS_URL) as websocket:
        while True:
            response = await websocket.recv()
            data = json.loads(response)

            # Extract necessary fields (modify based on actual API response structure)
            timestamp = datetime.now()  # Use current time as timestamp
            open_price = float(data["price"])
            high_price = float(data["price"])  # Adjust based on actual data
            low_price = float(data["price"])   # Adjust based on actual data
            close_price = float(data["price"]) # Adjust based on actual data
            volume = float(data["volume_24h"])

            # Append to market data list
            market_data_list.append([timestamp, open_price, high_price, low_price, close_price, volume])

            # Convert to DataFrame
            df = pd.DataFrame(market_data_list, columns=["Date", "Open", "High", "Low", "Close", "Volume"])
            df.set_index("Date", inplace=True)

            # Keep the latest 100 data points to avoid memory overload
            df = df.tail(100)

            # Plot candlestick chart and save as image
            mpf.plot(df, type="candle", style="charles", volume=True, title="PYUSD Market Data", savefig="market_data_plot.png")

            await asyncio.sleep(5)  # Adjust based on the WebSocket update interval

# Run the WebSocket connection
asyncio.run(fetch_market_data())
