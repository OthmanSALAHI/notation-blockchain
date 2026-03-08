import React, { useState, useEffect } from "react";
import type { Enseignant } from "../hooks/useContract";

interface RateTeacherProps {
  enseignants: Enseignant[];
  isConnected: boolean;
  voting: boolean;
  error: string | null;
  success: string | null;
  noterEnseignant: (teacherId: number, note: number) => Promise<void>;
  aDejaVote: (teacherId: number) => Promise<boolean>;
}

const RateTeacher: React.FC<RateTeacherProps> = ({
  enseignants,
  isConnected,
  voting,
  error,
  success,
  noterEnseignant,
  aDejaVote,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [votedTeachers, setVotedTeachers] = useState<Record<number, boolean>>({});

  // Check which teachers the student already voted for
  useEffect(() => {
    const checkVotes = async () => {
      if (!isConnected) return;
      const results: Record<number, boolean> = {};
      for (const e of enseignants) {
        results[e.id] = await aDejaVote(e.id);
      }
      setVotedTeachers(results);
    };
    checkVotes();
  }, [enseignants, isConnected]);

  const handleSubmit = async () => {
    if (!selectedTeacher || !selectedNote) return;
    await noterEnseignant(selectedTeacher, selectedNote);
    // Mark as voted
    setVotedTeachers((prev) => ({ ...prev, [selectedTeacher]: true }));
    setSelectedNote(null);
    setSelectedTeacher(null);
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
        <span>📝</span> Noter un Enseignant
      </h2>

      {/* Not connected warning */}
      {!isConnected && (
        <div className="bg-yellow-900 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-lg mb-4 text-sm">
          ⚠️ Connectez votre MetaMask pour pouvoir noter un enseignant.
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-900 border border-green-600 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      {/* Teacher selection */}
      <div className="mb-6">
        <label className="text-gray-400 text-sm mb-2 block">
          Sélectionner un enseignant
        </label>
        <div className="grid grid-cols-1 gap-2">
          {enseignants.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun enseignant disponible.</p>
          ) : (
            enseignants.map((e) => (
              <button
                key={e.id}
                disabled={!isConnected || votedTeachers[e.id]}
                onClick={() => setSelectedTeacher(e.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 text-left
                  ${votedTeachers[e.id]
                    ? "border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed"
                    : selectedTeacher === e.id
                    ? "border-indigo-500 bg-indigo-900 text-white"
                    : "border-gray-700 bg-gray-800 text-gray-300 hover:border-indigo-400 hover:bg-gray-700"
                  }`}
              >
                <span className="font-medium">{e.nom}</span>
                {votedTeachers[e.id] && (
                  <span className="text-xs bg-green-800 text-green-400 px-2 py-1 rounded-full">
                    ✓ Déjà voté
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Star rating */}
      {selectedTeacher && (
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-3 block">
            Choisir une note
          </label>
          <div className="flex gap-3 justify-center">
            {stars.map((star) => (
              <button
                key={star}
                onClick={() => setSelectedNote(star)}
                className={`text-4xl transition-all duration-150 hover:scale-125 active:scale-95
                  ${selectedNote !== null && star <= selectedNote
                    ? "text-yellow-400"
                    : "text-gray-600"
                  }`}
              >
                ★
              </button>
            ))}
          </div>
          {selectedNote && (
            <p className="text-center text-gray-400 text-sm mt-2">
              Note sélectionnée: <span className="text-yellow-400 font-bold">{selectedNote}/5</span>
            </p>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedTeacher || !selectedNote || voting || !isConnected}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200
          ${!selectedTeacher || !selectedNote || voting || !isConnected
            ? "bg-gray-700 cursor-not-allowed text-gray-500"
            : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95"
          }`}
      >
        {voting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Transaction en cours...
          </span>
        ) : (
          "Soumettre la note"
        )}
      </button>
    </div>
  );
};

export default RateTeacher;