const { createAccount, changePassword } = require('./scripts/account');
const {
  init,
  saveData,
  getTransactionReceipt
} = require('./scripts/transaction');

module.exports = {
  createAccount,
  changePassword,
  init,
  saveData,
  getTransactionReceipt
};
