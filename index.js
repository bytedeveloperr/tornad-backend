const express = require("express")
const mongoose = require("mongoose")
const { router } = require("./app/config/routes")
const cors = require("cors")
const { errorMiddleware } = require("./app/middleware/errorMiddleware")
const { notFoundMiddleware } = require("./app/middleware/notFoundMiddleware")

const app = express()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(router)

app.use("*", notFoundMiddleware())

app.use(errorMiddleware())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
