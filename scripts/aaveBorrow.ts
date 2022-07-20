import { BigNumber } from "ethers";
import { ethers, getNamedAccounts } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { getWeth } from "../scripts/getWeth";
const AMOUNT = ethers.utils.parseEther("0.02");

const approveERC20 = async (
  erc20Address: Address,
  spenderAddress: Address,
  amountToSpend: BigNumber,
  account: Address
) => {
  const erc20Token = await ethers.getContractAt(
    "IERC20",
    erc20Address,
    account
  );
  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
};

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
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending Pool address ${(await lendingPool).address}`);

  // deposit
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  // approve
  await approveERC20(
    wethTokenAddress,
    (
      await lendingPool
    ).address,
    AMOUNT,
    deployer
  );
  console.log("Depositing...");
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log("Deposited!");
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
