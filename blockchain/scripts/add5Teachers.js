const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const teachers = [
    "Dr. Jean Dupont",
    "Dr. Marie Martin",
    "Dr. Pierre Bernard",
    "Dr. Sophie Dubois",
    "Dr. Ahmed Benali"
  ];

  console.log("Adding 5 teachers to the contract...\n");

  let signer;
  if (process.env.ADMIN_PRIVATE_KEY) {
    signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, ethers.provider);
  } else {
    [signer] = await ethers.getSigners();
  }

  const contract = await ethers.getContractAt("NotationEnseignant", contractAddress, signer);
  const owner = await contract.proprietaire();
  const signerAddress = await signer.getAddress();

  if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
    throw new Error(
      `Signer ${signerAddress} is not contract owner ${owner}. Use ADMIN_PRIVATE_KEY for the owner account.`
    );
  }

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
