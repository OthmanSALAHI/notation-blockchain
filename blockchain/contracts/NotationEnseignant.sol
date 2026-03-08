// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NotationEnseignant {

    // ─────────────────────────────────────────
    // STRUCTURES
    // ─────────────────────────────────────────

    struct Enseignant {
        string nom;
        uint256 totalNotes;      // sum of all ratings
        uint256 nombreVotes;     // number of votes
        bool existe;             // teacher exists
    }

    // ─────────────────────────────────────────
    // STATE VARIABLES
    // ─────────────────────────────────────────

    address public proprietaire;
    uint256 public nombreEnseignants;

    // teacherId => Enseignant
    mapping(uint256 => Enseignant) public enseignants;

    // anonymous hash => has voted (anonymity)
    // keccak256(studentAddress + teacherId) => bool
    mapping(bytes32 => bool) private aVote;

    // ─────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────

    event EnseignantAjoute(uint256 indexed id, string nom);
    event NoteAjoutee(uint256 indexed teacherId, uint256 note);

    // ─────────────────────────────────────────
    // CONSTRUCTOR
    // ─────────────────────────────────────────

    constructor() {
        proprietaire = msg.sender;
    }

    // ─────────────────────────────────────────
    // MODIFIERS
    // ─────────────────────────────────────────

    modifier seulementProprietaire() {
        require(msg.sender == proprietaire, "Seulement le proprietaire");
        _;
    }

    modifier enseignantExiste(uint256 _id) {
        require(enseignants[_id].existe, "Enseignant introuvable");
        _;
    }

    // ─────────────────────────────────────────
    // FUNCTIONS
    // ─────────────────────────────────────────

    // Add a teacher (only owner)
    function ajouterEnseignant(string memory _nom) public seulementProprietaire {
        nombreEnseignants++;
        enseignants[nombreEnseignants] = Enseignant({
            nom: _nom,
            totalNotes: 0,
            nombreVotes: 0,
            existe: true
        });
        emit EnseignantAjoute(nombreEnseignants, _nom);
    }

    // Submit anonymous rating (1 to 5)
    function noterEnseignant(uint256 _teacherId, uint256 _note)
        public
        enseignantExiste(_teacherId)
    {
        require(_note >= 1 && _note <= 5, "La note doit etre entre 1 et 5");

        // Generate anonymous hash to hide student identity
        bytes32 hashEtudiant = keccak256(abi.encodePacked(msg.sender, _teacherId));

        require(!aVote[hashEtudiant], "Vous avez deja note cet enseignant");

        // Mark as voted
        aVote[hashEtudiant] = true;

        // Update ratings
        enseignants[_teacherId].totalNotes += _note;
        enseignants[_teacherId].nombreVotes++;

        emit NoteAjoutee(_teacherId, _note);
    }

    // Get average rating (automatically calculated)
    function getMoyenne(uint256 _teacherId)
        public
        view
        enseignantExiste(_teacherId)
        returns (uint256)
    {
        if (enseignants[_teacherId].nombreVotes == 0) {
            return 0;
        }
        return enseignants[_teacherId].totalNotes / enseignants[_teacherId].nombreVotes;
    }

    // Get public statistics
    function getStatistiques(uint256 _teacherId)
        public
        view
        enseignantExiste(_teacherId)
        returns (
            string memory nom,
            uint256 moyenne,
            uint256 nombreVotes
        )
    {
        Enseignant memory e = enseignants[_teacherId];
        uint256 moy = e.nombreVotes == 0 ? 0 : e.totalNotes / e.nombreVotes;
        return (e.nom, moy, e.nombreVotes);
    }

    // Check if student already voted (without revealing identity)
    function aDejaVote(uint256 _teacherId) public view returns (bool) {
        bytes32 hashEtudiant = keccak256(abi.encodePacked(msg.sender, _teacherId));
        return aVote[hashEtudiant];
    }

    // Get all teachers list
    function getTousEnseignants()
        public
        view
        returns (uint256[] memory ids, string[] memory noms)
    {
        ids = new uint256[](nombreEnseignants);
        noms = new string[](nombreEnseignants);
        for (uint256 i = 1; i <= nombreEnseignants; i++) {
            ids[i - 1] = i;
            noms[i - 1] = enseignants[i].nom;
        }
        return (ids, noms);
    }
}
