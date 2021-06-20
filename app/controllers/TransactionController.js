const { Web3Helper } = require("../helpers/Web3")
const { User } = require("../models/User")
const { Wallet } = require("../models/Wallet")
const { Covalent } = require("../helpers/Covalent")
const { Controller } = require("../helpers/Controller")

const covalent = new Covalent()

class TransactionController {
  async createTransfer(req, res, next) {
    try {
      const { user, body } = req

      const web3 = new Web3Helper(body.chain)

      const senderWallet = await Wallet.findOne({ user: user._id })
      if (!senderWallet) {
        throw new Error("Sender Wallet not found")
      }

      let receiverWallet
      if (body.receiverUsername) {
        const receiver = await User.findOne({ username: body.receiverUsername })
        if (!receiver) {
          throw new Error("Receiver username does not exist")
        }

        receiverWallet = await Wallet.findOne({ _id: receiver.wallets[0] }, "address")
      } else {
        receiverWallet = body.receiverWallet
      }

      senderWallet.privateKey = web3.decryptPrivateKey(senderWallet.privateKey, process.env.PP).privateKey
      const transaction = await web3.createTransaction(
        {
          to: receiverWallet.address,
          from: senderWallet.address,
          value: body.amount,
          gas: 0.00000000000003,
        },
        senderWallet.privateKey
      )
      Controller.success(res, "Transaction successful", transaction)
    } catch (e) {
      next(e)
    }
  }

  async fetchTransactions(req, res, next) {
    try {
      let chains
      const { query, user } = req
      try {
        chains = JSON.parse(process.env.CHAINS)
      } catch (e) {
        chins = { ftm: 4002, matic: 80001, eth: 42, bsc: 97, avax: 43113 }
      }

      const wallet = await Wallet.findOne({ user: user._id }, "address")

      const chainId = !!query.chain ? chains[query.chain.toLowerCase()] : chains["eth"]
      const transactions = await covalent.getTransactions(chainId, wallet.address)

      Controller.success(res, `${query.chain.toUpperCase()} Transactions loaded`, transactions)
    } catch (e) {
      console.log(e)
      next(e)
    }
  }

  async fetchTransaction(req, res, next) {
    try {
      const { query, params } = req,
        chains = JSON.parse(process.env.CHAINS)

      const chainId = chains[query.chain] || chains["eth"]
      const transaction = await covalent.getTransaction(chainId, params.hash)

      Controller.success(res, `Transaction fetched`, transaction)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TransactionController()
