# ppbm 
A node module to interact with blockchain for fmms project

# Installation

- Install module
     ```
     npm install --save ppbm@finterra/ppbm.js#master
     ```
- Add keystore
    ```
    mkdir keystore
    cd keystore
    ```
    Copy past keystore file in `keystore` folder.
- Add abi in root folder

# Usage
- ##### Init

```node
const { init } = require('fmms');
init({
  web3Url: 'https://ropsten.infura.io/<token>',
  ownerAddress: <owner-address>,
  keystorePath: <keystore-path>,
  abi: require(<abi-path>),
  password: <password>,
  contractAddress: <contract-address>,
});
```

- ##### createAccount
```node
  const { createAccount } = require('fmms');
  const password = '123';
  createAccount(password)
    .then(account => {
      console.log('Account created');
      console.log(account);
    })
    .catch(error => {
      console.log(error);
    });
```
- ##### changePassword
```node
  const { changePassword } = require('fmms');
  const oldPassword = '123';
  const privateKeyObj = {...};
  const newPassword = 'new123';
  changePassword(oldPassword, privateKeyObj, newPassword)
    .then(account => {
      console.log('Password changed');
      console.log(account);
    })
    .catch(error => {
      console.log(error);
    });
```
- ##### saveData
```node
 const { saveData } = require('fmms');
  const dataJSON = { test: 'testing' };
  const dataType = 1; // 1 = user info, TBD for others
  
  const userObj = {
    userId: 'IN12323',
    userAddress: '0x3023427da0f663358f77026add8924b42cb9d332'
  };
  
  const privateKeyObj = {...};
  const password = '123';
  const loginObject = {
    password,
    privateKeyObj
  };

  // save data in blockchain
  saveData(dataJSON, dataType, userObj, loginObject)
    .then(data => {
      console.log('saveData done');
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
```

