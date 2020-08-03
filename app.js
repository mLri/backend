const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

const app = express()

/* use midle ware */
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))

/* mongodb connection */
// const mongoURI = `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const mongoURI = `mongodb://mlrigod:${process.env.DB_PASSWORD}@cluster0-shard-00-00.gs0hy.mongodb.net:27017,cluster0-shard-00-01.gs0hy.mongodb.net:27017,cluster0-shard-00-02.gs0hy.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-26its2-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose
  .connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(err)
  });

/* use routes */
app.use('/api/v1', require('./routes'))

app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`))