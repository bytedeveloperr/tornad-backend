const { Wallet } = require("../models/Wallet")
const { Covalent } = require("../helpers/Covalent")
const { Controller } = require("../helpers/Controller")

const covalent = new Covalent()

class WalletController {
  async getWallet(req, res, next) {
    try {
      const wallet = await Wallet.find({ user: req.user._id }, "address")
      Controller.success(res, `Wallet fetched`, wallet)
    } catch (e) {
      next(e)
    }
  }

  async getBalances(req, res, next) {
    try {
      let chains
      const { query, user } = req
      try {
        chains = JSON.parse(process.env.CHAINS)
      } catch (e) {
        chains = { ftm: 4002, matic: 80001, eth: 42, bsc: 97, avax: 43113 }
      }

      const wallet = await Wallet.findOne({ user: user._id }, "address")

      if (!wallet) {
        throw new Error("Wallet not found")
      }

      const data = []
      if (query.chain) {
        const chainId = chains[query.chain.toLowerCase() === "bnbt" ? "bsc" : query.chain.toLowerCase()]
        const balance = await covalent.getBalance(chainId, wallet.address)

        Controller.success(res, `${query.chain.toUpperCase()} balance fetched`, balance)
      } else {
        for (const chain in chains) {
          const chainId = chains[chain]
          const balance = await covalent.getBalance(chainId, wallet.address)
          data.push(balance)
        }

        Controller.success(res, `Balances fetched`, data)
      }
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new WalletController()
