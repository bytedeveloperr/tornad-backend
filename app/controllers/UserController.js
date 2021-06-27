const argon2 = require("argon2")
const mongoose = require("mongoose")
const { Controller } = require("../helpers/Controller")
const { Web3Helper } = require("../helpers/Web3")
const { User } = require("../models/User")
const { Wallet } = require("../models/Wallet")

const web3 = new Web3Helper()

class UserController {
  async updateUserDetails(req, res, next) {
    try {
      const session = await mongoose.startSession()
      const { user, body } = req

      if (!body.username) {
        throw new Error("Username cannot be empty")
      }

      let keystore
      if (body.username !== user.username) {
        const wallet = Wallet.findOne({ user: user._id })
        if (wallet) {
          const secret = Buffer.from(user.username).toString("base64")
          const privateKey = web3.decryptKeystore(wallet.keystore, secret).privateKey

          const newSecret = Buffer.from(body.username).toString("base64")
          keystore = web3.getKeystore(privateKey, newSecret)
        }
      }

      session.withTransaction(async () => {
        if (keystore) {
          await Wallet.updateOne({ user: user._id }, { keystore })
        }
        await User.updateOne({ _id: user._id }, { name: body.name, email: body.email, username: body.username })

        Controller.success(res, "User successfully updated")
      })
    } catch (e) {
      next(e)
    }
  }

  async getUser(req, res, next) {
    try {
      const { user } = req
      user["password"] = undefined

      Controller.success(res, "User successfully fetched", user)
    } catch (e) {
      next(e)
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { user, body } = req

      if (!body.oldPassword) {
        throw new Error("Old password is required")
      }
      if (!body.newPassword) {
        throw new Error("New password is required")
      }

      if (!(await argon2.verify(user.password, body.oldPassword))) {
        throw new Error("Old password is not correct")
      }

      if (await argon2.verify(user.password, body.newPassword)) {
        throw new Error("Old password cannot be the same as new password")
      }

      const password = await argon2.hash(body.newPassword)
      await User.updateOne({ _id: user._id }, { password })
      Controller.success(res, "User password successfully updated", user)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()
