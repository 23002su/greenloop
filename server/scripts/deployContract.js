const hre = require("hardhat");

async function main() {
  const BatteryCommonsAuction = await hre.ethers.getContractFactory(
    "BatteryCommonsAuction"
  );

  const auction = await BatteryCommonsAuction.deploy();

  await auction.waitForDeployment();

  console.log("BatteryCommonsAuction deployed at:", auction.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
