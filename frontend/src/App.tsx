import React from "react";
import { useContract } from "./hooks/useContract";
import ConnectWallet from "./components/ConnectWallet";
import RateTeacher from "./components/RateTeacher";
import Statistics from "./components/Statistics";
import AdminPanel from "./components/AdminPanel";

const App: React.FC = () => {
  const {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
    enseignants,
    loadingEnseignants,
    noterEnseignant,
    aDejaVote,
    voting,
    ajouterEnseignant,
    addingTeacher,
    error,
    success,
    refreshData,
  } = useContract();

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── NAVBAR ── */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <ConnectWallet
          account={account}
          isConnected={isConnected}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />
      </div>

      {/* ── HERO ── */}
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-3">
          Système de{" "}
          <span className="text-indigo-400">Notation d'Enseignants</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Évaluez vos enseignants de manière <span className="text-indigo-300 font-medium">anonyme</span> et{" "}
          <span className="text-indigo-300 font-medium">sécurisée</span> grâce à la blockchain.
        </p>

        {/* Stats summary */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-400">
              {enseignants.length}
            </p>
            <p className="text-gray-500 text-sm">Enseignants</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-400">
              {enseignants.reduce((acc, e) => acc + e.nombreVotes, 0)}
            </p>
            <p className="text-gray-500 text-sm">Votes totaux</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-400">
              {enseignants.length > 0
                ? (
                    enseignants
                      .filter((e) => e.nombreVotes > 0)
                      .reduce((acc, e) => acc + e.moyenne, 0) /
                    (enseignants.filter((e) => e.nombreVotes > 0).length || 1)
                  ).toFixed(1)
                : "—"}
            </p>
            <p className="text-gray-500 text-sm">Moyenne générale</p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left — Rate Teacher */}
          <RateTeacher
            enseignants={enseignants}
            isConnected={isConnected}
            voting={voting}
            error={error}
            success={success}
            noterEnseignant={noterEnseignant}
            aDejaVote={aDejaVote}
          />

          {/* Right — Statistics */}
          <Statistics
            enseignants={enseignants}
            loading={loadingEnseignants}
            refreshData={refreshData}
          />
        </div>

        <AdminPanel
          isConnected={isConnected}
          ajouterEnseignant={ajouterEnseignant}
          addingTeacher={addingTeacher}
        />
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-800 py-4 text-center text-gray-600 text-sm">
        🔗 Powered by Blockchain · Votes anonymes et sécurisés
      </footer>

    </div>
  );
};

export default App;