const { Web3Helper } = require("../helpers/Web3")
const { User } = require("../models/User")
const { Wallet } = require("../models/Wallet")
const { Covalent } = require("../helpers/Covalent")
const { Controller } = require("../helpers/Controller")

const covalent = new Covalent()

class TransactionController {
  async createTransfer(req, res, next) {
    try {
      const { query, user, body } = req

      const web3 = new Web3Helper(query.chain?.toLowerCase())

      const senderWallet = await Wallet.findOne({ user: user._id })
      if (!senderWallet) {
        throw new Error("Sender Wallet not found")
      }

      let receiverAddress
      if (body.receiverUsername) {
        const receiver = await User.findOne({ username: body.receiverUsername })
        if (!receiver) {
          throw new Error("Receiver username does not exist")
        }

        let wallet = await Wallet.findOne({ _id: receiver.wallets[0] }, "address")
        receiverAddress = wallet.address
      } else {
        receiverAddress = body.receiverAddress
      }

      const secret = Buffer.from(user.username).toString("base64")
      const privateKey = web3.decryptKeystore(senderWallet.keystore, secret).privateKey
      const transaction = await web3.createTransaction(
        {
          to: receiverAddress,
          from: senderWallet.address,
          value: String(body.amount),
        },
        privateKey
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
        chains = { ftm: 4002, matic: 80001, eth: 42, bsc: 97, avax: 43113 }
      }

      const wallet = await Wallet.findOne({ user: user._id }, "address")

      const chainId = chains[query.chain.toLowerCase() === "bnbt" ? "bsc" : query.chain.toLowerCase()]
      const transactions = await covalent.getTransactions(chainId, wallet.address)

      Controller.success(res, `${query.chain.toUpperCase()} Transactions loaded`, transactions)
    } catch (e) {
      next(e)
    }
  }

  async fetchTransaction(req, res, next) {
    try {
      let chains
      const { query, params } = req
      try {
        chains = JSON.parse(process.env.CHAINS)
      } catch (e) {
        chains = { ftm: 4002, matic: 80001, eth: 42, bsc: 97, avax: 43113 }
      }

      const chainId = chains[query.chain.toLowerCase() === "bnbt" ? "bsc" : query.chain.toLowerCase()]
      const transaction = await covalent.getTransaction(chainId, params.hash)

      Controller.success(res, `Transaction fetched`, transaction)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TransactionController()
