const { Schema, Types, model } = require("mongoose")

const Wallet = new Schema({
  address: {
    type: String,
    required: false,
  },
  keystore: {
    type: JSON,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
})

module.exports = { Wallet: model("Wallet", Wallet) }
