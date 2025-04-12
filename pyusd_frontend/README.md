# 🟡 PYUSD Dashboard

A real-time, data-driven dashboard inspired by [Ultra Sound Money](https://ultrasound.money/), designed to track and visualize the performance, adoption, and network impact of **PYUSD (PayPal USD)** on the Ethereum blockchain.

## 🚀 Overview

**PYUSD Dashboard** is a web-based tool that aggregates key metrics and analytics about PYUSD, offering insights into:

- 💸 Supply changes & mint/burn activity
- 📈 Adoption trends & wallet distribution
- ⚡ Transaction volume & on-chain activity
- 🧠 Integration impact on Ethereum gas usage
- 🔗 DeFi protocols & ecosystem usage

Built with **React**, **TypeScript**, **Tailwind CSS**, and powered by **The Graph**, **Ethers.js**, and **Ethereum JSON-RPC**, this project is perfect for users who want to keep a pulse on the stablecoin shaping PayPal’s blockchain future.

---

## 📊 Features

- **Live Supply Tracker** – Monitor real-time total supply, minted and burned PYUSD.
- **Adoption Heatmap** – Visualize wallet growth, holder distribution, and transfer volume.
- **Ethereum Impact Analysis** – See how PYUSD usage contributes to Ethereum’s gas fees and block space.
- **DeFi & Exchange Integration** – Track where PYUSD is used (Uniswap, Curve, Aave, etc.).
- **Mint/Burn Events Feed** – Chronological list of on-chain minting and burning activity.
- **Custom Timeframes** – Filter and compare data across 24h, 7d, 30d, and all-time metrics.

---

## 💡 Interesting Facts About PYUSD

- **Launched by PayPal** in August 2023, PYUSD is issued by Paxos and fully backed by USD deposits and equivalents.
- **ERC-20 Stablecoin** – PYUSD operates natively on Ethereum and is fully transparent via on-chain proof.
- **Adoption** – Rapidly integrated into major wallets (MetaMask, Coinbase), DeFi protocols, and exchanges.
- **Usage** – As of early 2025, PYUSD has processed millions in daily transactions and is used for remittances, savings, and DeFi activities.
- **Compliance-first Design** – Built with regulatory clarity and institutional support in mind.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI,
- **State Management**: React Context
- **Data Sources**:
  - [The Graph](https://thegraph.com/) (for indexed Ethereum data)
  - [Ethers.js](https://docs.ethers.org/) (for on-chain reads)
  - [Dune Analytics](https://dune.com/) API (optional for visual queries)
- **Visualization**: Recharts / Chart.js / D3.js

---

## 🧑‍💻 Getting Started

```
# Clone the repo
git clone git@github.com:Dannynsikak/PYUSD.git
cd PYUSD

# Install dependencies
pnpm install

# Run the app
pnpm run dev
Configure your environment:

env


# .env.local
REACT_APP_ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
REACT_APP_GRAPH_API=https://api.thegraph.com/subgraphs/name/YOUR_SUBGRAPH
📁 Project Structure



src/
├── components/       # Reusable UI components
├── features/         # Redux slices and features
├── services/         # GraphQL, Ethers.js hooks
├── pages/            # Dashboard routes
├── utils/            # Helper functions
├── assets/           # Images, logos
└── App.tsx           # Root component
🌍 Live Demo
Visit the Dashboard

🤝 Contributing
Contributions are welcome! Whether it's improving visualizations, adding new metrics, or fixing bugs, feel free to submit a pull request.

Fork the repository

Create a new branch

Make your changes

Submit a PR 🚀

🛡️ License
This project is licensed under the MIT License.
Feel free to fork, build on, or modify it for your own PYUSD or stablecoin-related projects.

📬 Contact
For feedback, collaboration, or inquiries: Your Name – Ofonime Nsikak Eno
📧 Email: nsikakdanny11@gmail.com
```
