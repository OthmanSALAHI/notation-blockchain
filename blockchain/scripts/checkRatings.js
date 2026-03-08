const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("Checking all teachers and their ratings...\n");

  const contract = await ethers.getContractAt("NotationEnseignant", contractAddress);
  
  const [ids, noms] = await contract.getTousEnseignants();
  
  console.log(`Total teachers: ${ids.length}\n`);
  
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const nom = noms[i];
    
    const stats = await contract.getStatistiques(id);
    
    console.log(`─────────────────────────────────────`);
    console.log(`ID: ${id}`);
    console.log(`Nom: ${nom}`);
    console.log(`Moyenne: ${stats.moyenne.toString()}/5`);
    console.log(`Nombre de votes: ${stats.nombreVotes.toString()}`);
  }
  
  console.log(`─────────────────────────────────────\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
