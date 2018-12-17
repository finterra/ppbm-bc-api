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

  const dataJSON = { test: 'testing' };
  const dataType = 1; // 1 = user info, TBD for others
  // preparing userObj
  const userObj = {
    userId: 'IN12323',
    userAddress: '0x3023427da0f663358f77026add8924b42cb9d332' // '0x0272333daa8Fe5f5895c39919cCb87bF3917fd9E',
  };
  // preparing loginObject
  const privateKeyObj = {
    address: '3023427da0f663358f77026add8924b42cb9d332',
    crypto: {
      cipher: 'aes-128-ctr',
      ciphertext:
        '5d1233f76c2bcae181e5415c597da5967aeba2b9b5cf9bb41d125fe70c09e93a',
      cipherparams: { iv: '2ed81c6f878ce397092accca6d8db6df' },
      mac: 'd693a341e83528f1538ceb2b95d2888889dc33b49ccd69e4a7a633c178997f28',
      kdf: 'pbkdf2',
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: 'hmac-sha256',
        salt: 'ec0079653b16ec361b4d182d7faf8384ccbf597832507ac6a1254bb9ae4d2493'
      }
    },
    id: '818b5cea-ae29-4021-92e1-28ccbab28e54',
    version: 3
  };
  const password = '123';
  const loginObject = {
    password,
    privateKeyObj
  };

  // save data in blockchain
  saveData(dataJSON, 1, userObj, loginObject)
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
  contractAddress: '0xcE3d3b82CaF3Fd6DaE25a65dE215b01547df7C26',
  keystorePath: './',
  password: '12345678'
});
saveTransactionInBC();
