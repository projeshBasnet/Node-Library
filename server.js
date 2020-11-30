 if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const homeRoute = require('./routes/index')
const authorRoute = require('./routes/authors')
const bookRoute = require('./routes/books')
const bodyParser = require('body-parser')
const methodoverride = require('method-override')

const app = express()

// middleware api
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(expressLayout)
app.use(methodoverride('_method'))

// setting mongoose connection
mongoose.connect(process.env.CONNECTION_URL, { useUnifiedTopology:true, useNewUrlParser:true })
const db = mongoose.connection
db.on('error',error=> console.error(error))
db.once('open',()=> console.log('Connected to mongoose')
)


// set node engine
app.set('view engine','ejs')
app.set('layout','layouts/layout')

// setting the routes path
app.use('/',homeRoute.route)
app.use('/authors',authorRoute.router)
app.use('/books',bookRoute.router)

const port =process.env.port || 3000
app.listen(port,()=>{
    console.log(`Server running at ${port}`)
    
})