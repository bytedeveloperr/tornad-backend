const Web3 = require("web3")

class Web3Helper {
  constructor(chain = "eth") {
    switch (chain) {
      case "eth":
        this.web3 = new Web3(process.env.ETH_NODE)
        break
      case "avax":
        this.web3 = new Web3(process.env.AVAX_NODE)
        break
      case "bsc":
        this.web3 = new Web3(process.env.BSC_NODE)
        break
      case "ftm":
        this.web3 = new Web3(process.env.FTM_NODE)
        break
      case "matic":
        this.web3 = new Web3(process.env.MATIC_NODE)
        break
      default:
        this.web3 = new Web3(process.env.ETH_NODE)
        break
    }
  }

  async createAccount() {
    return await this.web3.eth.accounts.create()
  }

  getKeystore(privateKey, password) {
    return this.web3.eth.accounts.encrypt(privateKey, password)
  }

  decryptKeystore(keystore, password) {
    return this.web3.eth.accounts.decrypt(keystore, password)
  }

  async createTransaction({ to, value, from }, privateKey) {
    const nonce = await this.web3.eth.getTransactionCount(from, "latest")

    const txContruct = {
      nonce,
      to,
      value: this.toWei(value),
    }
    txContruct.gas = await this.estimateGas(txContruct)

    const signedTx = await this.web3.eth.accounts.signTransaction(txContruct, privateKey)
    return await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  }

  toWei(amount, unit = "ether") {
    return this.web3.utils.toWei(amount, unit)
  }

  async estimateGas(txObject) {
    return await this.web3.eth.estimateGas(txObject)
  }
}

module.exports = { Web3Helper }
