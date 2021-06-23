const axios = require("axios")

class Covalent {
  constructor(apiKey = process.env.COVALENT_APIKEY) {
    this.axios = axios.create({
      baseURL: "https://api.covalenthq.com/v1",
    })
    this.apikey = apiKey
  }

  async getBalance(chainId, address) {
    try {
      const url = `/${chainId}/address/${address}/balances_v2/?key=${this.apikey}`
      const response = await this.axios.get(url)
      return response.data.data
    } catch (e) {
      if (e.response?.data) {
        throw new Error(e.response.data.error_message)
      }
      throw new Error(e)
    }
  }

  async getTransactions(chainId, address) {
    try {
      const url = `/${chainId}/address/${address}/transactions_v2/?key=${this.apikey}`
      const response = await this.axios.get(url)
      return response.data.data
    } catch (e) {
      if (e.response?.data) {
        throw new Error(e.response.data.error_message)
      }
      throw new Error(e)
    }
  }

  async getTransaction(chainId, hash) {
    try {
      const url = `/${chainId}/transaction_v2/${hash}/?key=${this.apikey}`
      const response = await this.axios.get(url)
      return response.data.data
    } catch (e) {
      if (e.response?.data) {
        throw new Error(e.response.data.error_message)
      }
      throw new Error(e)
    }
  }

  async getSpotPrices(tickers) {
    try {
      const url = `/pricing/tickers/?key=${this.apikey}`
      const response = await this.axios.get(url)
      return response.data.data
    } catch (e) {
      if (e.response?.data) {
        throw new Error(e.response.data.error_message)
      }
      throw new Error(e)
    }
  }
}

module.exports = { Covalent }
