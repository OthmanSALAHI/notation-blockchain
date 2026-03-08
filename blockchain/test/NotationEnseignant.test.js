const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NotationEnseignant", function () {
  let contract;
  let proprietaire;
  let etudiant1;
  let etudiant2;
  let etudiant3;

  // Deploy a fresh contract before each test
  beforeEach(async function () {
    [proprietaire, etudiant1, etudiant2, etudiant3] = await ethers.getSigners();

    const NotationEnseignant = await ethers.getContractFactory("NotationEnseignant");
    contract = await NotationEnseignant.deploy();
    await contract.waitForDeployment();

    // Add two teachers by default for all tests
    await contract.ajouterEnseignant("Prof. Hassan");
    await contract.ajouterEnseignant("Prof. Fatima");
  });

  // ─────────────────────────────────────────
  // TEST 1 — Adding teachers
  // ─────────────────────────────────────────
  describe("Ajouter un enseignant", function () {

    it("Le proprietaire peut ajouter un enseignant", async function () {
      const stats = await contract.getStatistiques(1);
      expect(stats.nom).to.equal("Prof. Hassan");
    });

    it("Le nombre d'enseignants est correct", async function () {
      expect(await contract.nombreEnseignants()).to.equal(2);
    });

    it("Un non-proprietaire ne peut pas ajouter un enseignant", async function () {
      await expect(
        contract.connect(etudiant1).ajouterEnseignant("Prof. Ahmed")
      ).to.be.revertedWith("Seulement le proprietaire");
    });

  });

  // ─────────────────────────────────────────
  // TEST 2 — Rating a teacher
  // ─────────────────────────────────────────
  describe("Noter un enseignant", function () {

    it("Un etudiant peut noter un enseignant", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 5);
      const stats = await contract.getStatistiques(1);
      expect(stats.nombreVotes).to.equal(1);
    });

    it("La note doit etre entre 1 et 5", async function () {
      await expect(
        contract.connect(etudiant1).noterEnseignant(1, 6)
      ).to.be.revertedWith("La note doit etre entre 1 et 5");

      await expect(
        contract.connect(etudiant1).noterEnseignant(1, 0)
      ).to.be.revertedWith("La note doit etre entre 1 et 5");
    });

    it("Un enseignant inexistant ne peut pas etre note", async function () {
      await expect(
        contract.connect(etudiant1).noterEnseignant(99, 4)
      ).to.be.revertedWith("Enseignant introuvable");
    });

  });

  // ─────────────────────────────────────────
  // TEST 3 — One vote per student
  // ─────────────────────────────────────────
  describe("Une seule note par etudiant", function () {

    it("Un etudiant ne peut pas noter deux fois le meme enseignant", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 4);
      await expect(
        contract.connect(etudiant1).noterEnseignant(1, 5)
      ).to.be.revertedWith("Vous avez deja note cet enseignant");
    });

    it("Un etudiant peut noter deux enseignants differents", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 4);
      await contract.connect(etudiant1).noterEnseignant(2, 3);

      const stats1 = await contract.getStatistiques(1);
      const stats2 = await contract.getStatistiques(2);

      expect(stats1.nombreVotes).to.equal(1);
      expect(stats2.nombreVotes).to.equal(1);
    });

  });

  // ─────────────────────────────────────────
  // TEST 4 — Automatic average calculation
  // ─────────────────────────────────────────
  describe("Calcul automatique de la moyenne", function () {

    it("La moyenne est 0 si personne n'a vote", async function () {
      expect(await contract.getMoyenne(1)).to.equal(0);
    });

    it("La moyenne est correcte apres un vote", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 4);
      expect(await contract.getMoyenne(1)).to.equal(4);
    });

    it("La moyenne est correcte apres plusieurs votes", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 4);
      await contract.connect(etudiant2).noterEnseignant(1, 2);
      await contract.connect(etudiant3).noterEnseignant(1, 3);
      // (4 + 2 + 3) / 3 = 3
      expect(await contract.getMoyenne(1)).to.equal(3);
    });

  });

  // ─────────────────────────────────────────
  // TEST 5 — Public statistics
  // ─────────────────────────────────────────
  describe("Statistiques publiques", function () {

    it("Les statistiques sont accessibles publiquement", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 5);
      await contract.connect(etudiant2).noterEnseignant(1, 3);

      const stats = await contract.getStatistiques(1);
      expect(stats.nom).to.equal("Prof. Hassan");
      expect(stats.nombreVotes).to.equal(2);
      expect(stats.moyenne).to.equal(4); // (5+3)/2 = 4
    });

    it("La liste des enseignants est publique", async function () {
      const [ids, noms] = await contract.getTousEnseignants();
      expect(noms[0]).to.equal("Prof. Hassan");
      expect(noms[1]).to.equal("Prof. Fatima");
    });

  });

  // ─────────────────────────────────────────
  // TEST 6 — Anonymity
  // ─────────────────────────────────────────
  describe("Anonymat", function () {

    it("aDejaVote retourne false avant de voter", async function () {
      expect(await contract.connect(etudiant1).aDejaVote(1)).to.equal(false);
    });

    it("aDejaVote retourne true apres avoir vote", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 5);
      expect(await contract.connect(etudiant1).aDejaVote(1)).to.equal(true);
    });

    it("Le vote d'un etudiant n'affecte pas le statut d'un autre", async function () {
      await contract.connect(etudiant1).noterEnseignant(1, 5);
      expect(await contract.connect(etudiant2).aDejaVote(1)).to.equal(false);
    });

  });

});