const { Controller } = require("../helpers/Controller")

const errorMiddleware = () => {
  return (err, _req, res, _next) => {
    Controller.error(res, err.message, err.status)
  }
}

module.exports = { errorMiddleware }
