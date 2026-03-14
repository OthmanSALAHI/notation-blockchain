import React, { useState } from "react";
import adminCredentials from "../data/adminCredentials.json";

interface AdminPanelProps {
  isConnected: boolean;
  enseignants: { id: number; nom: string }[];
  ajouterEnseignant: (nom: string) => Promise<void>;
  addingTeacher: boolean;
  supprimerEnseignant: (teacherId: number) => Promise<void>;
  deletingTeacher: boolean;
}

const SESSION_KEY = "admin_authenticated";

const AdminPanel: React.FC<AdminPanelProps> = ({
  isConnected,
  enseignants,
  ajouterEnseignant,
  addingTeacher,
  supprimerEnseignant,
  deletingTeacher,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);

    const isValid = adminCredentials.admins.some(
      (admin) =>
        admin.username === username.trim() && admin.password === password
    );

    if (!isValid) {
      setLoginError("Identifiants invalides.");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "true");
    setIsAuthenticated(true);
    setUsername("");
    setPassword("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setTeacherName("");
    setActionError(null);
    setActionSuccess(null);
  };

  const handleAddTeacher = async (event: React.FormEvent) => {
    event.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    try {
      await ajouterEnseignant(teacherName);
      setTeacherName("");
      setActionSuccess("Enseignant ajouté avec succès.");
    } catch (err: any) {
      setActionError(err?.message || "Impossible d'ajouter l'enseignant.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg mt-6">
        <h2 className="text-white text-xl font-bold mb-4">Espace Admin</h2>
        <p className="text-gray-400 text-sm mb-5">
          Connectez-vous pour accéder à l'ajout d'enseignants.
        </p>

        {loginError && (
          <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            autoComplete="username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">Panneau Admin</h2>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors"
        >
          Se déconnecter
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-5">
        Ajoutez un enseignant. Votre wallet MetaMask doit être connecté avec le compte propriétaire du contrat.
      </p>

      {!isConnected && (
        <div className="bg-yellow-900 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-lg mb-4 text-sm">
          Connectez MetaMask avant d'envoyer la transaction.
        </div>
      )}

      {actionError && (
        <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
          {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="bg-green-900 border border-green-600 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">
          {actionSuccess}
        </div>
      )}

      <form onSubmit={handleAddTeacher} className="space-y-3">
        <input
          type="text"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="Nom du nouvel enseignant"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={!isConnected || addingTeacher}
          className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
            !isConnected || addingTeacher
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {addingTeacher ? "Transaction en cours..." : "Ajouter l'enseignant"}
        </button>
      </form>

      {enseignants.length > 0 && (
        <div className="mt-6">
          <h3 className="text-gray-400 text-sm mb-3">Enseignants enregistrés</h3>
          <div className="space-y-2">
            {enseignants.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg"
              >
                <span className="text-white text-sm">{e.nom}</span>
                <button
                  onClick={async () => {
                    setActionError(null);
                    setActionSuccess(null);
                    try {
                      await supprimerEnseignant(e.id);
                      setActionSuccess(`"${e.nom}" supprimé avec succès.`);
                    } catch (err: any) {
                      setActionError(err?.message || "Erreur lors de la suppression.");
                    }
                  }}
                  disabled={!isConnected || deletingTeacher}
                  className="text-xs bg-red-800 hover:bg-red-700 text-red-200 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingTeacher ? "..." : "Supprimer"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
