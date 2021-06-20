const Jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const authMiddleware = () => {
  return async (req, res, next) => {
    try {
      const bearerHeader = await req.headers.authorization
      if (!bearerHeader) {
        res.json({ error: "Bearer header is required" })
      }
      const bearerToken = bearerHeader.split(" ")[1]
      if (!bearerToken) {
        next(new Error("Bearer token is required"))
      }

      const { _id } = await Jwt.verify(bearerToken, process.env.JWT_SECRET)

      if (!_id) {
        next(new Error("User ID not found in Bearer token"))
      }
      req.user = await User.findOne({ _id })
      if (!req.user) {
        next(new Error("User not found"))
      }

      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = { authMiddleware }
