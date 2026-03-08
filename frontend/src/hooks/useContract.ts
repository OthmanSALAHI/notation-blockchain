import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { getReadOnlyContract, getSignedContract } from "../utils/contract";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface Enseignant {
  id: number;
  nom: string;
  moyenne: number;
  nombreVotes: number;
}

interface UseContractReturn {
  // Wallet
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;

  // Teachers
  enseignants: Enseignant[];
  loadingEnseignants: boolean;

  // Voting
  noterEnseignant: (teacherId: number, note: number) => Promise<void>;
  aDejaVote: (teacherId: number) => Promise<boolean>;
  voting: boolean;

  // Errors
  error: string | null;
  success: string | null;

  // Refresh
  refreshData: () => Promise<void>;
}

// ─────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────

export const useContract = (): UseContractReturn => {
  const [account, setAccount] = useState<string | null>(null);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [loadingEnseignants, setLoadingEnseignants] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ─────────────────────────────────────────
  // CONNECT METAMASK
  // ─────────────────────────────────────────
  const connectWallet = async () => {
    try {
      setError(null);

      if (!window.ethereum) {
        setError("MetaMask n'est pas installé. Veuillez l'installer.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

    } catch (err: any) {
      setError("Erreur de connexion: " + err.message);
    }
  };

  // ─────────────────────────────────────────
  // LOAD ALL TEACHERS + STATS
  // ─────────────────────────────────────────
  const refreshData = useCallback(async () => {
    try {
      setLoadingEnseignants(true);
      const contract = getReadOnlyContract();

      const [ids, noms] = await contract.getTousEnseignants();

      if (ids.length === 0) {
        setEnseignants([]);
        return;
      }

      const enseignantsList: Enseignant[] = await Promise.all(
        ids.map(async (id: bigint, index: number) => {
          const stats = await contract.getStatistiques(id);
          return {
            id: Number(id),
            nom: noms[index],
            moyenne: Number(stats.moyenne),
            nombreVotes: Number(stats.nombreVotes),
          };
        })
      );

      setEnseignants(enseignantsList);
    } catch (err: any) {
      setError("Erreur lors du chargement des enseignants: " + err.message);
    } finally {
      setLoadingEnseignants(false);
    }
  }, []);

  // ─────────────────────────────────────────
  // VOTE FOR A TEACHER
  // ─────────────────────────────────────────
  const noterEnseignant = async (teacherId: number, note: number) => {
    try {
      setError(null);
      setSuccess(null);
      setVoting(true);

      if (!window.ethereum) {
        setError("MetaMask n'est pas installé.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getSignedContract(signer);

      const tx = await contract.noterEnseignant(teacherId, note);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait(); // wait for transaction to be mined
      console.log("Transaction confirmed in block:", receipt.blockNumber);

      setSuccess("✅ Votre note a été enregistrée avec succès!");
      
      // Wait a bit for the data to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      await refreshData(); // refresh stats
      console.log("Data refreshed");

    } catch (err: any) {
      if (err.message.includes("Vous avez deja note")) {
        setError("❌ Vous avez déjà noté cet enseignant.");
      } else if (err.message.includes("user rejected")) {
        setError("❌ Transaction annulée.");
      } else {
        setError("❌ Erreur: " + err.message);
      }
    } finally {
      setVoting(false);
    }
  };

  // ─────────────────────────────────────────
  // CHECK IF ALREADY VOTED
  // ─────────────────────────────────────────
  const aDejaVote = async (teacherId: number): Promise<boolean> => {
    try {
      if (!window.ethereum || !account) return false;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getSignedContract(signer);

      return await contract.aDejaVote(teacherId);
    } catch {
      return false;
    }
  };

  // ─────────────────────────────────────────
  // AUTO CONNECT IF ALREADY CONNECTED
  // ─────────────────────────────────────────
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkConnection();
    refreshData();
  }, [refreshData]);

  return {
    account,
    isConnected: !!account,
    connectWallet,
    enseignants,
    loadingEnseignants,
    noterEnseignant,
    aDejaVote,
    voting,
    error,
    success,
    refreshData,
  };
};

// Extend window type for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}
