const { Router } = require("express")
const { registerUser, loginUser } = require("../controllers/AuthController")
const { IndexPage } = require("../controllers/IndexController")
const { createTransfer, fetchTransactions, fetchTransaction } = require("../controllers/TransactionController")
const { getWallet, getBalances } = require("../controllers/WalletController")
const { Controller } = require("../helpers/Controller")
const { Covalent } = require("../helpers/Covalent")
const { authMiddleware } = require("../middleware/authMiddleware")

const router = Router()

router.get("/", IndexPage)

// auth routes
router.post("/auth/register", registerUser)
router.post("/auth/login", loginUser)

// wallet routes
router.get("/wallet", authMiddleware(), getWallet)
router.get("/wallet/balances", authMiddleware(), getBalances)

// transactions
router.post("/transfer", authMiddleware(), createTransfer)
router.get("/transactions", authMiddleware(), fetchTransactions)
router.get("/transactions/:hash", authMiddleware(), fetchTransaction)

// misc
router.get("/spot-prices", async (req, res, next) => {
  try {
    const covalent = new Covalent()
    const spotPrices = await covalent.getSpotPrices()
    Controller.success(res, "Spot prices fetched", spotPrices)
  } catch (err) {
    next(err)
  }
})

module.exports = { router }
