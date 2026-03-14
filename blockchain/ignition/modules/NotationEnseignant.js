const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NotationEnseignantModule", (m) => {
  const ADMIN_ADDRESS = "0x799d2977D8C1eE172479F63354C6E6E7f189853C";

  // Deploy the contract
  const notationEnseignant = m.contract("NotationEnseignant", [ADMIN_ADDRESS]);

  return { notationEnseignant };
});