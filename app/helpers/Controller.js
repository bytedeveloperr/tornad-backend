class Controller {
  static success(res, message, data) {
    return res.status(200).json({ success: true, message, data })
  }

  static error(res, message) {
    return res.status(200).json({ error: true, message })
  }
}

module.exports = { Controller }
