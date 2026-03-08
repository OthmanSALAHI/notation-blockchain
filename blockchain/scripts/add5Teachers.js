const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const teachers = [
    "Dr. Jean Dupont",
    "Dr. Marie Martin",
    "Dr. Pierre Bernard",
    "Dr. Sophie Dubois",
    "Dr. Ahmed Benali"
  ];

  console.log("Adding 5 teachers to the contract...\n");

  const contract = await ethers.getContractAt("NotationEnseignant", contractAddress);

  for (let i = 0; i < teachers.length; i++) {
    console.log(`${i + 1}. Adding: ${teachers[i]}`);
    const tx = await contract.ajouterEnseignant(teachers[i]);
    await tx.wait();
    console.log(`   ✅ Added successfully!`);
  }

  console.log("\n✅ All 5 teachers added!");
  console.log("\nVerifying...");
  
  const [ids, noms] = await contract.getTousEnseignants();
  console.log(`\nTotal teachers: ${ids.length}`);
  console.log("List:");
  ids.forEach((id, index) => {
    console.log(`  ${id.toString()}. ${noms[index]}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
