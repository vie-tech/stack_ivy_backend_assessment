const express = require('express')
const app = express()
const router = require('./routes/user.routes').router
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cors({
    credentials: true,
    origin: "*"
}))
app.use(express.json())
app.use('/api/', router)
app.use(cookieParser())


app.listen(7000, ()=>{
    console.log('User service is up and listening')
})