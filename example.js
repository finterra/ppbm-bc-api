const { createAccount, changePassword, saveData } = require('./index');

function createAccountInBC() {
  const password = '123';
  const account = createAccount(password);
  console.log('Account created:');
  console.log(account);
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

  const account = changePassword(oldPassword, privateKeyObj, newPassword);
  console.log('Password changed');
  console.log(account);
}

function saveTransactionInBC() {
  saveData({ test: '132' }, 1);
}

// createAccountInBC();
// changePasswordInBC();
saveTransactionInBC();
