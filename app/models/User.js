const { Schema, Types, model } = require("mongoose")

const User = new Schema({
  name: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  wallets: [{ type: Types.ObjectId }],
})

module.exports = { User: model("User", User) }
