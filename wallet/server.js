const express = require('express')
const app = express()
const router = require('./routes/wallet.routes.js').router
const cookieParser = require('cookie-parser')
const cors = require('cors')


app.use(cors({
    credentials: true,
    origin: "*"
}))
app.use(express.json())
app.use('/api/', router)
app.use(cookieParser())




app.listen(8000, ()=>{
    console.log('Wallet service is up and listening')
})

