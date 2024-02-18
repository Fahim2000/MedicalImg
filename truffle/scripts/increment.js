
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = async function (callback) {
  const deployed = await SimpleStorage.deployed();

  const currentValue = (await deployed.read()).toNumber();
  console.log(`Current SimpleStorage value: ${currentValue}`);

  const { tx } = await deployed.write(currentValue + 1);
  console.log(`Confirmed transaction ${tx}`);

  const updatedValue = (await deployed.read()).toNumber();
  console.log(`Updated SimpleStorage value: ${updatedValue}`);

  callback();
};
