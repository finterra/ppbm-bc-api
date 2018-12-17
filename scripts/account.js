const keythereum = require('keythereum');

function createAccount(passphrase) {
  return new Promise((resolve, reject) => {
    try {
      var dk = keythereum.create();
      var key = keythereum.dump(passphrase, dk.privateKey, dk.salt, dk.iv);
      return resolve(key);
    } catch (error) {
      return reject(error);
    }
  });
}

function changePassword(oldPassword, privateKeyObj, newPassword) {
  return new Promise((resolve, reject) => {
    var privateKey = keythereum.recover(oldPassword, privateKeyObj);
    if (privateKey) {
      var key = keythereum.dump(
        newPassword,
        privateKey,
        privateKeyObj.crypto.kdfparams.salt,
        privateKeyObj.crypto.cipherparams.iv
      );
      var privateKey = keythereum.recover(newPassword, key);
      return resolve(key);
    } else {
      return reject('Something went wrong');
    }
  });
}

function addToWhiteList(arrayOfAddress) {
  
}

module.exports = { createAccount, changePassword };
