const { Router } = require("express")
const { registerUser, loginUser } = require("../controllers/AuthController")
const {
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  createContact,
} = require("../controllers/ContactController")
const { IndexPage } = require("../controllers/IndexController")
const { createTransfer, fetchTransactions, fetchTransaction } = require("../controllers/TransactionController")
const { updateUserDetails, getUser, updatePassword } = require("../controllers/UserController")
const { getWallet, getBalances, exportKeystore } = require("../controllers/WalletController")
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
router.post("/wallet/keystore", authMiddleware(), exportKeystore)

// transactions
router.post("/transfer", authMiddleware(), createTransfer)
router.get("/transactions", authMiddleware(), fetchTransactions)
router.get("/transactions/:hash", authMiddleware(), fetchTransaction)

// contacts
router.post("/contacts", authMiddleware(), createContact)
router.get("/contacts", authMiddleware(), getContacts)
router.get("/contacts/:id", authMiddleware(), getContact)
router.put("/contacts/:id", authMiddleware(), updateContact)
router.delete("/contacts/:id", authMiddleware(), deleteContact)

// user
router.put("/user", authMiddleware(), updateUserDetails)
router.get("/user", authMiddleware(), getUser)
router.put("/user/password", authMiddleware(), updatePassword)

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
