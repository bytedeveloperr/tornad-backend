class IndexController {
  async IndexPage(req, res) {
    res.send("Welcome to Tornad")
  }
}

module.exports = new IndexController()
