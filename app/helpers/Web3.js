const Web3 = require("web3")

class Web3Helper {
  constructor(chain = "eth") {
    switch (chain) {
      case "eth":
        this.web3 = new Web3(process.env.ETH_NODE)
        break
      case "avax":
        this.web3 = new Web3(process.env.AVAX_NODE)
      case "bsc":
        this.web3 = new Web3(process.env.BSC_NODE)
      case "ftm":
        this.etherToWei = new Web3(process.env.FTM_NODE)
      default:
        this.web3 = new Web3(process.env.ETH_NODE)
        break
    }
  }

  async createAccount() {
    return await this.web3.eth.accounts.create()
  }

  encryptPrivateKey(privateKey, password) {
    return this.web3.eth.accounts.encrypt(privateKey, password)
  }

  decryptPrivateKey(keystoreJsonV3, password) {
    return this.web3.eth.accounts.decrypt(keystoreJsonV3, password)
  }

  async createTransaction({ to, gas, value, from }, privateKey) {
    const nonce = await this.web3.eth.getTransactionCount(from, "latest")

    const txContruct = {
      nonce,
      to,
      gas: this.etherToWei(gas),
      value: this.etherToWei(value),
    }

    const signedTx = await this.web3.eth.accounts.signTransaction(txContruct, privateKey)
    return await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  }

  etherToWei(amount) {
    return amount * 1000000000000000000
  }
}

module.exports = { Web3Helper }
