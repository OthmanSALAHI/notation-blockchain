const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("Testing vote transaction...\n");

  const [signer] = await ethers.getSigners();
  console.log("Voting with account:", signer.address);
  
  const contract = await ethers.getContractAt("NotationEnseignant", contractAddress);
  
  console.log("\n1. Before voting - Dr. Jean Dupont stats:");
  let stats = await contract.getStatistiques(2);
  console.log("   Moyenne:", stats.moyenne.toString());
  console.log("   Votes:", stats.nombreVotes.toString());
  
  console.log("\n2. Submitting vote (Teacher ID: 2, Note: 5)...");
  try {
    const tx = await contract.noterEnseignant(2, 5);
    console.log("   Transaction hash:", tx.hash);
    
    console.log("   Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("   ✅ Transaction confirmed in block:", receipt.blockNumber);
    
    console.log("\n3. After voting - Dr. Jean Dupont stats:");
    stats = await contract.getStatistiques(2);
    console.log("   Moyenne:", stats.moyenne.toString());
    console.log("   Votes:", stats.nombreVotes.toString());
    
    console.log("\n✅ Vote recorded successfully!");
  } catch (error) {
    console.log("\n❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
