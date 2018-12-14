require('dotenv').config();
const { createAccount, changePassword } = require('./scripts/account');
const { saveData } = require('./scripts/transaction');

module.exports = {
  createAccount,
  changePassword,
  saveData
};
