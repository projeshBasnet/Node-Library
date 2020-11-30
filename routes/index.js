const express = require('express')
const route = express.Router()
const Book = require('../models/book')

route.get('/',async (req, res)=>{
    let books
    try {
         books = await Book.find().sort({posteddate:'desc'}).limit(10)
         res.render('main',{books:books})
        
    } catch {
        books = []
        res.render('main',{books:books})
        
    }
})

module.exports = { route }