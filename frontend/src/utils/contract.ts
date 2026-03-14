import { ethers } from "ethers";

// ─────────────────────────────────────────
// CONTRACT ADDRESS (deployed on localhost)
// ─────────────────────────────────────────
export const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// ─────────────────────────────────────────
// CONTRACT ABI
// ─────────────────────────────────────────
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_proprietaire",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "nom",
        "type": "string"
      }
    ],
    "name": "EnseignantAjoute",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "teacherId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "note",
        "type": "uint256"
      }
    ],
    "name": "NoteAjoutee",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_teacherId", "type": "uint256" }],
    "name": "aDejaVote",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_nom", "type": "string" }],
    "name": "ajouterEnseignant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "enseignants",
    "outputs": [
      { "internalType": "string", "name": "nom", "type": "string" },
      { "internalType": "uint256", "name": "totalNotes", "type": "uint256" },
      { "internalType": "uint256", "name": "nombreVotes", "type": "uint256" },
      { "internalType": "bool", "name": "existe", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_teacherId", "type": "uint256" }],
    "name": "getMoyenne",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_teacherId", "type": "uint256" }],
    "name": "getStatistiques",
    "outputs": [
      { "internalType": "string", "name": "nom", "type": "string" },
      { "internalType": "uint256", "name": "moyenne", "type": "uint256" },
      { "internalType": "uint256", "name": "nombreVotes", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTousEnseignants",
    "outputs": [
      { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" },
      { "internalType": "string[]", "name": "noms", "type": "string[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nombreEnseignants",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_teacherId", "type": "uint256" },
      { "internalType": "uint256", "name": "_note", "type": "uint256" }
    ],
    "name": "noterEnseignant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proprietaire",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ─────────────────────────────────────────
// GET CONTRACT INSTANCE
// ─────────────────────────────────────────

// Read-only (no wallet needed — for public stats)
export const getReadOnlyContract = () => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Read-write (wallet needed — for voting)
export const getSignedContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};