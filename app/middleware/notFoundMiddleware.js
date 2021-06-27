const { Controller } = require("../helpers/Controller")

const notFoundMiddleware = () => {
  return (req, res, _next) => {
    const err = new Error("Route not found")
    err.status = 404
    next(err)
  }
}

module.exports = { notFoundMiddleware }
