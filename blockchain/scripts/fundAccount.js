const { ethers } = require("hardhat");

async function main() {
  // Add your addresses here - paste them between the quotes
  const addresses = [
    "0x799d2977D8C1eE172479F63354C6E6E7f189853C",
    "0x6F6b4F9a3498Ac16B99CC183c88cF0AdA6450165",
    "0x57Ce583237BA7533FE14F7eb6661EcF4047786dB",
    "0x2Ed4825D3Ee648a9967bF6a122258703e2b06970",
    "0x166C1c1895F0eA56EAa60ADEf4548491A50Cd3Cb"
  ];
  
  const amountToSend = "599.0"; // ETH to send to each account
  
  const provider = ethers.provider;
  const [deployer] = await ethers.getSigners();
  
  console.log("═══════════════════════════════════════════");
  console.log("Funding Accounts with Test ETH");
  console.log("From:", deployer.address);
  console.log("Amount per account:", amountToSend, "ETH");
  console.log("═══════════════════════════════════════════\n");
  
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    
    console.log(`\n[${i + 1}/${addresses.length}] Address: ${address}`);
    
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    
    console.log("    Current balance:", balanceInEth, "ETH");
    
    console.log("    Sending", amountToSend, "ETH...");
    
    const tx = await deployer.sendTransaction({
      to: address,
      value: ethers.parseEther(amountToSend)
    });
    
    await tx.wait();
    
    const newBalance = await provider.getBalance(address);
    const newBalanceInEth = ethers.formatEther(newBalance);
    
    console.log("    ✅ Transfer complete!");
    console.log("    New balance:", newBalanceInEth, "ETH");
  }
  
  console.log("\n═══════════════════════════════════════════");
  console.log(`✅ Successfully funded ${addresses.length} account(s)!`);
  console.log("═══════════════════════════════════════════");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
