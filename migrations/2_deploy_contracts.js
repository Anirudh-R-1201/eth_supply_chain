const Asset = artifacts.require('Asset')

module.exports = function(deployer) {
  deployer.deploy(Asset, 'Item XYZ')
}