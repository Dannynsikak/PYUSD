import websockets
import asyncio
async def test_ws():
    async with websockets.connect("ws://localhost:8000/ws/market-data") as ws:
        while True:
            response = await ws.recv()
            print(f"Received: {response}")

asyncio.run(test_ws())