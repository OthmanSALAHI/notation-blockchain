import React from "react";
import { type Enseignant } from "../hooks/useContract";

interface StatisticsProps {
  enseignants: Enseignant[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const Statistics: React.FC<StatisticsProps> = ({
  enseignants,
  loading,
  refreshData,
}) => {
  const renderStars = (moyenne: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-xl ${
          star <= moyenne ? "text-yellow-400" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  const getMoyenneColor = (moyenne: number) => {
    if (moyenne >= 4) return "text-green-400";
    if (moyenne >= 3) return "text-yellow-400";
    if (moyenne >= 2) return "text-orange-400";
    return "text-red-400";
  };

  const getMoyenneLabel = (moyenne: number) => {
    if (moyenne === 0) return "Pas encore noté";
    if (moyenne >= 4.5) return "Excellent";
    if (moyenne >= 4) return "Très bien";
    if (moyenne >= 3) return "Bien";
    if (moyenne >= 2) return "Passable";
    return "Insuffisant";
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <span>📊</span> Statistiques Publiques
        </h2>
        <button
          onClick={refreshData}
          disabled={loading}
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Actualiser
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <svg className="animate-spin h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      )}

      {/* No teachers */}
      {!loading && enseignants.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">🏫</p>
          <p>Aucun enseignant disponible pour le moment.</p>
        </div>
      )}

      {/* Teachers list */}
      {!loading && enseignants.length > 0 && (
        <div className="space-y-4">
          {enseignants.map((e) => (
            <div
              key={e.id}
              className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-indigo-500 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                {/* Name + ID */}
                <div>
                  <span className="text-xs text-gray-500 font-mono">
                    #{e.id}
                  </span>
                  <h3 className="text-white font-semibold text-lg">{e.nom}</h3>
                </div>

                {/* Average score */}
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getMoyenneColor(e.moyenne)}`}>
                    {e.moyenne > 0 ? `${e.moyenne}/5` : "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getMoyenneLabel(e.moyenne)}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {renderStars(e.moyenne)}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    e.moyenne >= 4
                      ? "bg-green-500"
                      : e.moyenne >= 3
                      ? "bg-yellow-500"
                      : e.moyenne >= 2
                      ? "bg-orange-500"
                      : e.moyenne > 0
                      ? "bg-red-500"
                      : "bg-gray-600"
                  }`}
                  style={{ width: `${(e.moyenne / 5) * 100}%` }}
                />
              </div>

              {/* Votes count */}
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                {e.nombreVotes === 0
                  ? "Aucun vote"
                  : `${e.nombreVotes} vote${e.nombreVotes > 1 ? "s" : ""}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Anonymous note */}
      <p className="text-gray-600 text-xs text-center mt-6 flex items-center justify-center gap-1">
        <span>🕶️</span> Les votes sont anonymes — aucune identité n'est révélée.
      </p>
    </div>
  );
};

export default Statistics;