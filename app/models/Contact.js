const { Schema, Types, model } = require("mongoose")

const Contact = new Schema({
  name: {
    type: String,
    required: false,
  },
  addresses: [
    {
      address: { type: String },
      type: { type: String, default: "ERC_20" },
    },
  ],
  user: {
    type: Types.ObjectId,
    required: true,
  },
})

module.exports = { Contact: model("Contact", Contact) }
