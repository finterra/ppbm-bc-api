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
  keystorePath,
  password
}) {
  web3 = new Web3(web3Url);
  _owner = ownerAddress;
  _contractAddress = contractAddress;
  let abi = require('./abi/ropsten-abi.json');

  contractObj = new web3.eth.Contract(abi, _contractAddress);

  keythereum.importFromFile(_owner, keystorePath, function(keyObject) {
    privateKey = keythereum.recover(password, keyObject);
  });
}

async function signTransaction(from, to, functionData, resolve, reject) {
  const gasObj = {
    to,
    from,
    data: functionData
  };

  var gasPrice = await web3.eth.getGasPrice();
  gasPrice = new BigNumber(gasPrice);
  var gasEstimate = await web3.eth.estimateGas(gasObj);
  gasEstimate = new BigNumber(gasEstimate);
  var balance = await web3.eth.getBalance(from);
  balance = new BigNumber(balance);

  if (balance.isLessThan(gasEstimate.times(gasPrice))) {
    reject("Account doesn't have enough ether to make this transaction");
  } else {
    const nonce = await web3.eth.getTransactionCount(from);
    const tx = new Tx({
      to,
      nonce,
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
        console.log('receipt', receipt);
        resolve([receipt]);
      })
      .on('error', error => {
        reject(error.toString());
      });
  }
}

function saveData(dataObj, type) {
  return new Promise(async (resolve, reject) => {
    try {
      const sha3 = web3.utils.sha3(JSON.stringify(dataObj));
      let data = contractObj.methods.saveData(sha3, type).encodeABI();
      console.log(data);
      signTransaction(_owner, _contractAddress, data, resolve, reject).then(
        function(error, response) {
          if (error) {
            reject(error);
          } else {
            return resolve('Successful', response);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { init, saveData };
