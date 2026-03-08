const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NotationEnseignantModule", (m) => {

  // Deploy the contract
  const notationEnseignant = m.contract("NotationEnseignant");

  return { notationEnseignant };
});