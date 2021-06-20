const express = require("express")
const mongoose = require("mongoose")
const { router } = require("./app/config/routes")
const { Controller } = require("./app/helpers/Controller")
const cors = require("cors")

const app = express()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(router)

app.use("*", (_req, _res, next) => {
  const err = new Error("Route not found")
  next(err)
})

app.use((err, _req, res, _next) => {
  Controller.error(res, err.message)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
