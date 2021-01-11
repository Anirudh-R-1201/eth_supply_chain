const Asset = artifacts.require('./Asset.sol')

module.exports = async function(callback){
  try {
    console.log(Asset.abi, Asset.bytecode)
    const assetContract = new web3.eth.Contract(Asset.abi)
    assetContract.deploy({
      data: Asset.bytecode,
      arguments: ['My Product']
    }).send({
      from :'0x14A8F066Cbd5428A3ccb6821fBB4667D9ea05f4d'
    }).on('receipt',(receipt) => {
      console.log(receipt.contractAddress) 
    })
  }
  catch(error) {
    console.log(error)
  }

  callback()
}