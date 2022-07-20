import { ethers, getNamedAccounts } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { getWeth } from "../scripts/getWeth";

const getLendingPool = async (account: Address) => {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  );
  const lendingPoolAddress =
    await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  return lendingPool;
};

const main = async () => {
  await getWeth();
  const { deployer } = await getNamedAccounts();
  // Lending Pool Address provider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
  const lendingPool = getLendingPool(deployer);
  console.log(`Lending Pool address ${(await lendingPool).address}`);
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
