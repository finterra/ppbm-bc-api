const keythereum = require('keythereum');
const Tx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');
const ethUtil = require('ethereumjs-util');
const Web3 = require('web3');

let web3, _owner, _contractAddress;
let privateKey;
let contractObj;

function init({
  web3Url,
  ownerAddress,
  contractAddress,
  keystoreObj,
  password,
  abi
}) {
  web3 = new Web3(web3Url);
  _owner = ownerAddress;
  _contractAddress = contractAddress;
  contractObj = new web3.eth.Contract(abi, _contractAddress);
  privateKey = keythereum.recover(password, keystoreObj);
  // keythereum.importFromFile(_owner, keystorePath, function(keyObject) {
  //   privateKey = keythereum.recover(password, keyObject);
  // });
}

function signTransaction(from, to, functionData, callback) {
  const gasObj = {
    to,
    from,
    data: functionData
  };
  const gasPricePromise = web3.eth.getGasPrice();
  const estimateGasPromise = web3.eth.estimateGas({ gasObj });
  const geBalancePromise = web3.eth.getBalance(from);
  const noncePromise = web3.eth.getTransactionCount(from);
  Promise.all([
    gasPricePromise,
    estimateGasPromise,
    geBalancePromise,
    noncePromise
  ])
    .then(values => {
      console.log(values);
      const gasPrice = new BigNumber(values[0]);
      let gasEstimate = new BigNumber(values[1]);
      const balance = new BigNumber(values[2]);
      const nonce = values[3];
      console.log('functionData', functionData);

      if (balance.isLessThan(gasEstimate.times(gasPrice))) {
        callback("Account doesn't have enough ether to make this transaction");
      } else {
        const tx = new Tx({
          to,
          nonce: nonce,
          value: '0x',
          gasPrice: web3.utils.toHex(gasPrice.toString()),
          gasLimit: web3.utils.toHex(gasEstimate.plus(200000).toString()),
          data: functionData
        });
        tx.sign(privateKey);
        web3.eth
          .sendSignedTransaction('0x' + tx.serialize().toString('hex'))
          .on('transactionHash', hash => {
            console.log('transaction hash', hash);
          })
          .on('receipt', receipt => {
            callback(null, receipt);
          })
          .on('error', error => {
            callback(error.toString());
          });
      }
    })
    .catch(error => {
      console.log('error', error);
      callback(error);
    });
}

function saveData(
  dataObj,
  type,
  { userId, userAddress },
  { privateKeyObj, password }
) {
  return new Promise(async (resolve, reject) => {
    try {
      const { address } = privateKeyObj;
      const _modifierAddress = '0x' + address;
      _save(
        dataObj,
        type,
        userId,
        userAddress,
        privateKeyObj,
        password,
        (error, response) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(response);
          }
        }
      );
    } catch (error) {
      return reject(error);
    }
  });
}

function _save(
  dataObj,
  type,
  userId,
  userAddress,
  privateKeyObj,
  password,
  cb
) {
  const { address } = privateKeyObj;
  const privateKeyBuffer = keythereum.recover(password, privateKeyObj);
  const message = JSON.stringify(dataObj);
  const privateKey = '0x' + privateKeyBuffer.toString('hex');
  const signatureObj = web3.eth.accounts.sign('message', privateKey);
  const result = web3.eth.accounts.recover(signatureObj);

  const { messageHash, v, r, s } = signatureObj;
  const _modifierAddress = '0x' + address;
  const _uniqueId = web3.utils.toHex(userId);

  let data = contractObj.methods
    .saveData(
      type,
      messageHash,
      parseInt(v, 16),
      r,
      s,
      _uniqueId,
      userAddress,
      _modifierAddress
    )
    .encodeABI();
  console.log('_contractAddress', _contractAddress);
  signTransaction(_owner, _contractAddress, data, cb);
}

module.exports = { init, saveData };
