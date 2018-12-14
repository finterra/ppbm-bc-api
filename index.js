require('dotenv').config();
const { createAccount, changePassword } = require('./scripts/account');
const { init, saveData } = require('./scripts/transaction');

module.exports = {
  createAccount,
  changePassword,
  init,
  saveData
};
