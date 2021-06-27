class Controller {
  static success(res, message, data) {
    return res.status(200).json({ success: true, message, data })
  }

  static error(res, message, status = 500) {
    return res.status(status).json({ error: true, message })
  }
}

module.exports = { Controller }
