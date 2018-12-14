const keythereum = require('keythereum');

function createAccount(passphrase) {
  console.log('Creating account with ', passphrase);
  var dk = keythereum.create();
  var key = keythereum.dump(passphrase, dk.privateKey, dk.salt, dk.iv);
  return key;
}

function changePassword(oldPassword, privateKeyObj, newPassword) {
  var privateKey = keythereum.recover(oldPassword, privateKeyObj);
  if (privateKey) {
    // console.log(privateKey);
    var key = keythereum.dump(
      newPassword,
      privateKey,
      privateKeyObj.crypto.kdfparams.salt,
      privateKeyObj.crypto.cipherparams.iv
    );
    var privateKey = keythereum.recover(newPassword, key);
    console.log(privateKey);
    return key;
  } else {
    throw Error('Something went wrong');
  }
}

module.exports = { createAccount, changePassword };
