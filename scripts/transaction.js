const keythereum = require('keythereum');
const Tx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');
const ethUtil = require('ethereumjs-util');
const Web3 = require('web3');

let web3 = new Web3(process.env.URL + process.env.TOKEN);
let abi = require(process.env.ABI_PATH);

const OWNER = '0x633642C036DB81FB7a726a37A8B42254556B56F0';
CONTRACT_ADDRESS = '0x95D7176f14d5427EFaAc264873895D348D132EeA';
const contractObj = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

const datadir = './';
let privateKey;
keythereum.importFromFile(OWNER, datadir, function(keyObject) {
  privateKey = keythereum.recover('12345678', keyObject);
});

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
    console.log('privateKey', privateKey);
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
      signTransaction(OWNER, CONTRACT_ADDRESS, data, resolve, reject).then(
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

module.exports = { saveData };
