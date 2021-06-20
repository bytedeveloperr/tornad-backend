const { User } = require("../models/User")
const argon2 = require("argon2")
const { Controller } = require("../helpers/Controller")
const { Web3Helper } = require("../helpers/Web3")
const { Wallet } = require("../models/Wallet")
const mongoose = require("mongoose")
const Jwt = require("jsonwebtoken")

class AuthController extends Controller {
  async registerUser(req, res, next) {
    try {
      const { username, password } = req.body

      const existingUser = await User.findOne({ username })

      if (existingUser) {
        throw new Error("A user already exists with this username")
      }

      const userConstruct = {
        username,
        password: await argon2.hash(password),
      }

      const web3Helper = new Web3Helper()
      const account = await web3Helper.createAccount()

      const walletConstruct = {
        address: account.address,
        privateKey: await web3Helper.encryptPrivateKey(account.privateKey, process.env.PP),
      }

      const session = await mongoose.startSession()

      session.withTransaction(async () => {
        let user = await User.create(userConstruct)
        const wallet = await Wallet.create({ ...walletConstruct, user: user._id })
        await User.updateOne({ _id: wallet.user }, { $push: { wallets: wallet._id } })

        Controller.success(res, "User successfully created", {
          token: await Jwt.sign({ _id: user.id }, process.env.JWT_SECRET),
        })
      })
    } catch (e) {
      next(e)
    }
  }

  async loginUser(req, res, next) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })

      if (!user) {
        throw new Error("User with this username does not exist")
      }
      if (!(await argon2.verify(user.password, password))) {
        throw new Error("The password you provided is not correct")
      }

      Controller.success(res, "User successfully created", {
        token: await Jwt.sign({ _id: user.id }, process.env.JWT_SECRET),
      })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new AuthController()
