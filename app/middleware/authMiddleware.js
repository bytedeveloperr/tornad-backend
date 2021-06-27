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
        const err = new Error("Bearer token is required")
        err.status = 401
        next(err)
      }

      const { _id } = await Jwt.verify(bearerToken, process.env.JWT_SECRET)

      if (!_id) {
        const err = new Error("User ID not found in Bearer token")
        err.status = 401
        next(err)
      }
      req.user = await User.findOne({ _id })
      if (!req.user) {
        const err = new Error("Loggedin user may have been deleted or logged out")
        err.status = 401
        next(err)
      }

      next()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = { authMiddleware }
