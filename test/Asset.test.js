
const Asset = artifacts.require('./Asset.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Asset', (accounts) => {
  let asset, creator, sender, receiver

  const STATUSES = {
    CREATED: 0,
    SENT: 1,
    RECEIVED: 2
  }

  before(async () => {
    asset = await Asset.new('item XYZ')
    creator = accounts[0]
  })

  describe('creation', () => {
    it('deploys successfully', async () => {
      assert.notEqual(asset.address, 0x0)
      assert.notEqual(asset.address, '')
      assert.notEqual(asset.address, null)
      assert.notEqual(asset.address, undefined)
    })

    it('sets name', async () => {
      const name = await asset.name()
      assert.equal(name, 'item XYZ')
    })

    it('sets custodian', async () => {
      const custodian = await asset.custodian()
      assert.equal(custodian, creator)
    })

    it('sets status', async () => {
      const status = await asset.status()
      assert.equal(status, STATUSES.CREATED)
    })

    it('logs an action', async () => {
      const actions = await asset.getPastEvents('Action', { fromBlock: 0, toBlock: 'latest' } )
      const action = actions[actions.length - 1].args
      assert.equal(action.name, 'CREATE')
      assert.equal(action.account, creator)
      assert.equal(action.custodian, creator)
      assert.typeOf(action.timestamp, 'object')
    })
  })

  describe('send()', () => {

    describe('FAILURE', () => {

      it('must be SENT by custodian', async () => {
        sender = accounts[1] // Receiver cannot send
        receiver = accounts[1]
        await asset.send(receiver, { from: sender }).should.be.rejected;
      })

      it('custodian cannot be recipient', async () => {
        sender = accounts[0]
        receiver = accounts[0] // Cannot be custodian
        await asset.send(receiver, { from: receiver }).should.be.rejected;
      })

    })

    describe('SUCCESS', () => {

      before(async () => {
        sender = accounts[0]
        receiver = accounts[1]
        await asset.send(receiver, { from: sender })
      })

      it('sets custodian', async () => {
        const custodian = await asset.custodian()
        assert.equal(custodian, receiver)
      })

      it('sets status', async () => {
        const status = await asset.status()
        assert.equal(status, STATUSES.SENT)
      })

      it('logs action', async () => {
        const actions = await asset.getPastEvents('Action', { fromBlock: 0, toBlock: 'latest' } )
        const action = actions[actions.length - 1].args
        assert.equal(action.name, 'SEND')
        assert.equal(action.account, sender)
        assert.equal(action.custodian, receiver)
        assert.typeOf(action.timestamp, 'object')
      })
    })
  })

  describe('receive()', () => {

    describe('FAILURE', () => {

      it('RECEIVED by custodian', async () => {
        receiver = accounts[9] // Some account
        await asset.receive({ from: receiver }).should.be.rejected;
      })

    })

    describe('SUCCESS', () => {

      before(async () => {
        receiver = accounts[1]
        await asset.receive({ from: receiver })
      })

      it('sets custodian', async () => {
        const custodian = await asset.custodian()
        assert.equal(custodian, receiver)
      })

      it('sets status', async () => {
        const status = await asset.status()
        assert.equal(status, STATUSES.RECEIVED)
      })

      it('logs an action', async () => {
        const actions = await asset.getPastEvents('Action', { fromBlock: 0, toBlock: 'latest' } )
        const action = actions[actions.length - 1].args
        assert.equal(action.name, 'RECEIVE')
        assert.equal(action.account, receiver)
        assert.equal(action.custodian, receiver)
        assert.typeOf(action.timestamp, 'object')
      })
    })
  })
})