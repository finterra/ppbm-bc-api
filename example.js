const { createAccount, changePassword, saveData, init } = require('./index');

function createAccountInBC() {
  const password = '123';

  createAccount(password)
    .then(account => {
      console.log('Account created');
      console.log(account);
    })
    .catch(error => {
      console.log(error);
    });
}

function changePasswordInBC() {
  const oldPassword = '123';
  const privateKeyObj = {
    address: 'a24f826adb652825aa82b6e18c7a98999ebb9e71',
    crypto: {
      cipher: 'aes-128-ctr',
      ciphertext:
        'f5c8570d69eb32b21736914f0c36da1366a058c50bdb71127ed9ea3149ee2d8e',
      cipherparams: { iv: 'a712fae743076f7d19f50163baff9846' },
      mac: '022139365b507d0aec6ed7738a916c0bf77a2a32e8319a6e53a60267e7b9dbff',
      kdf: 'pbkdf2',
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: 'hmac-sha256',
        salt: '940d269a919e1a4ebf2a39edad2d16bc15d76019133b55203b644bd643f4d256'
      }
    },
    id: 'ebda7a85-1c3c-4eff-97a1-9a46e48cf5f8',
    version: 3
  };
  const newPassword = 'new123';
  changePassword(oldPassword, privateKeyObj, newPassword)
    .then(account => {
      console.log('Password changed');
      console.log(account);
    })
    .catch(error => {
      console.log(error);
    });
}

function saveTransactionInBC() {
  saveData({ test: '132' }, 1)
    .then(data => {
      console.log('saveData done');
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
}

// createAccountInBC();
// changePasswordInBC();
init({
  web3Url: 'https://ropsten.infura.io/qe93eRW1ZLx44WsdN2wh',
  ownerAddress: '0x633642C036DB81FB7a726a37A8B42254556B56F0',
  contractAddress: '0x95D7176f14d5427EFaAc264873895D348D132EeA',
  keystorePath: './',
  password: '12345678'
});
saveTransactionInBC();
