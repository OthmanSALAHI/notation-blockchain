# 📚 Notation Enseignants - Blockchain Rating System

A decentralized application (DApp) for anonymous teacher rating using blockchain technology. Students can rate their teachers anonymously and securely, with all votes recorded immutably on the Ethereum blockchain.

## ✨ Features

- 🔐 **Anonymous Voting**: Student identities are protected using cryptographic hashing
- 🎯 **One Vote Per Teacher**: Smart contract prevents duplicate votes
- 👑 **Admin Panel**: Contract owner can add new teachers
- 📊 **Real-time Statistics**: View ratings, averages, and vote counts
- 🌐 **Web3 Integration**: Seamless MetaMask connection
- ⚡ **Fast & Secure**: Built on Ethereum with Hardhat and Solidity

## 🛠️ Tech Stack

### Blockchain
- **Solidity** ^0.8.0 - Smart contract language
- **Hardhat** - Development environment
- **Ethers.js** v6 - Blockchain interaction library

### Frontend
- **React** 18 - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **MetaMask** - Web3 wallet

## 📁 Project Structure

```
notation-blockchain/
├── blockchain/                 # Smart contract project
│   ├── contracts/
│   │   └── NotationEnseignant.sol  # Main smart contract
│   ├── scripts/
│   │   ├── add5Teachers.js    # Add sample teachers
│   │   ├── checkRatings.js    # View all ratings
│   │   └── fundAccount.js     # Fund accounts with test ETH
│   ├── ignition/modules/
│   │   └── NotationEnseignant.js   # Deployment script
│   └── test/
│       └── NotationEnseignant.test.js
│
└── frontend/                  # React application
    ├── src/
    │   ├── components/
    │   │   ├── ConnectWallet.tsx
    │   │   ├── RateTeacher.tsx
    │   │   └── Statistics.tsx
    │   ├── hooks/
    │   │   └── useContract.ts
    │   └── utils/
    │       └── contract.ts    # Contract ABI & address
    └── public/
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd notation-blockchain
   ```

2. **Install blockchain dependencies**
   ```bash
   cd blockchain
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Step 1: Start Hardhat Node

Open a terminal and start the local blockchain:

```bash
cd blockchain
npx hardhat node
```

Keep this terminal running! It will show:
- 20 pre-funded accounts
- Account #0 is the contract owner

#### Step 2: Deploy Smart Contract

In a new terminal:

```bash
cd blockchain
npx hardhat ignition deploy ignition/modules/NotationEnseignant.js --network localhost
```

Copy the deployed contract address and update it in `frontend/src/utils/contract.ts`

#### Step 3: Add Sample Teachers

```bash
npx hardhat run scripts/add5Teachers.js --network localhost
```

This adds 5 teachers:
- Dr. Jean Dupont
- Dr. Marie Martin
- Dr. Pierre Bernard
- Dr. Sophie Dubois
- Dr. Ahmed Benali

#### Step 4: Start Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`

#### Step 5: Configure MetaMask

1. **Add Localhost Network**
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. **Import Admin Account** (to access admin panel)
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d727c2c57e3`
   - This is Hardhat's Account #0 (contract owner)

3. **Import Student Account** (for voting)
   - Import any other Hardhat account
   - Fund it with test ETH (see below)

#### Step 6: Fund Student Accounts

Edit `blockchain/scripts/fundAccount.js` and add your MetaMask addresses:

```javascript
const addresses = [
  "0xYourMetaMaskAddress1",
  "0xYourMetaMaskAddress2",
];
```

Run the script:

```bash
npx hardhat run scripts/fundAccount.js --network localhost
```

Each account will receive 10 test ETH for transaction fees.

## 📖 Usage Guide

### For Students

1. **Connect Wallet**
   - Click "Connecter MetaMask"
   - Select your student account

2. **Vote for a Teacher**
   - Select a teacher from the list
   - Choose a rating (1-5 stars)
   - Click "Soumettre la note"
   - Approve the transaction in MetaMask
   - ✅ Success! Your vote is recorded

3. **View Statistics**
   - See all teachers with their:
     - Average rating
     - Number of votes
     - Star visualization
     - Progress bars

**Note**: You can only vote once per teacher. The smart contract prevents duplicate votes.

### For Admins

1. **Connect with Owner Account**
   - Use the imported Hardhat Account #0
   - The purple admin panel will appear

2. **Add Teachers**
   - Enter teacher name (e.g., "Dr. John Smith")
   - Click "Ajouter un enseignant"
   - Approve transaction
   - ✅ New teacher added!

## 🔧 Useful Scripts

### Check All Ratings

```bash
cd blockchain
npx hardhat run scripts/checkRatings.js --network localhost
```

### Test Contract Owner

```bash
npx hardhat run scripts/checkOwner.js --network localhost
```

### Run Tests

```bash
npx hardhat test
```

### Compile Contracts

```bash
npx hardhat compile
```

## 📝 Smart Contract Details

### Main Functions

- `ajouterEnseignant(string nom)` - Add a teacher (owner only)
- `noterEnseignant(uint256 teacherId, uint256 note)` - Vote for a teacher (1-5)
- `getStatistiques(uint256 teacherId)` - Get teacher statistics
- `getTousEnseignants()` - Get all teachers
- `aDejaVote(uint256 teacherId)` - Check if already voted

### Security Features

- ✅ Only contract owner can add teachers
- ✅ One vote per student per teacher
- ✅ Anonymous voting (uses hash of student address + teacherId)
- ✅ Rating validation (1-5 only)
- ✅ Immutable vote records

## 🐛 Troubleshooting

### "Error: could not detect network"
- Make sure Hardhat node is running (`npx hardhat node`)
- Check MetaMask is on "Localhost 8545" network

### "Insufficient funds for transaction"
- Run the fundAccount script to get test ETH
- Make sure you're on the local network

### "Admin panel not showing"
- You must be connected with the contract owner account
- Check you imported the correct private key
- Verify owner address matches: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

### "Ratings not updating after vote"
- Hard refresh browser (Ctrl + Shift + R)
- Check browser console for errors
- Verify transaction was confirmed in MetaMask

### "Transaction failed"
- Check you have enough test ETH
- Verify you haven't already voted for that teacher
- Look at the error message in MetaMask

## 🌐 Deploying to Testnet

To deploy on Sepolia or other testnets:

1. **Get testnet ETH** from a faucet
2. **Update hardhat.config.js**:
   ```javascript
   networks: {
     sepolia: {
       url: "YOUR_ALCHEMY_OR_INFURA_URL",
       accounts: ["YOUR_PRIVATE_KEY"]
     }
   }
   ```
3. **Deploy**:
   ```bash
   npx hardhat ignition deploy ignition/modules/NotationEnseignant.js --network sepolia
   ```
4. **Update frontend** with new contract address

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Blockchain Technology**