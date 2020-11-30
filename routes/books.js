const express = require('express')
const Author = require('../models/author')
const Book = require('../models/book')
const router = express.Router()
const fs = require('fs')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']



// getting search books
router.get('/', async (req, res) => {
    let query = Book.find()
    try {
        if(req.query.title !=null && req.query.title !=''){
            query = query.regex('title',RegExp(req.query.title,'i'))
        }
        if(req.query.publishbefore != null && req.query.publishbefore !=''){
            query = query.lte('publishdate',req.query.publishbefore)
        }
        if(req.query.publishbefore != null && req.query.publishbefore !=''){
            query = query.lte('publishdate',req.query.publishbefore)
        }
       
        const books = await query
        res.render('books/index', { books: books,searchoptions:req.query})

    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})



// creating a new book
router.get('/new', async (req, res) => {
    const book = new Book()
    try {
        const authors = await Author.find()
        res.render('books/new', { authors: authors, book: book })

    } catch {
        res.redirect('/books')
    }
})

// view each book
router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const book = await Book.findById(id).populate('author')        
        const params = {
            book: book
        }
        res.render('books/eachbook', params)

    } catch (e) {
        console.log(e)

        res.redirect('/books')

    }
})

// handling post request 
router.post('/', async (req, res) => {
    const book = Book({
        title: req.body.title,
        description: req.body.description,
        publishdate: new Date(req.body.pubdate),
        author: req.body.author,
    })
    

    saveCover(book,req.body.cover)
    try {
        await book.save()
        res.redirect('/books')
    }
    catch(e){
        console.log(e)
        
        renderNewBook(book, res, 'new', true)
    }
})

// updating a book
router.get('/:id/edit', async (req, res) => {
    const id = req.params.id
    const authors = await Author.find()
    let book
    try {
        book = await Book.findById(id)
        res.render('books/update', { book: book, authors: authors })

    } catch {
        if (book != null) {
            res.render('books/eachbook', { book: book, errmsg: "Some error has occured in editing" })
        }
        else {
            res.redirect('/books')
        }

    }
})

// for handling update request
router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id).populate('author')
        book.title = req.body.title
        book.description = req.body.description
        book.publishdate = new Date(req.body.pubdate)
        if(req.body.cover){
        saveCover(book,req.body.cover)
        }       
        await book.save()
        res.render('books/eachbook', { book: book })

    }
    catch (e) {
        console.log(e)
        res.redirect('/books')

    }
})


// deleting a book
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')

    } catch (e) {
        console.log(e)
        if (book != null) {
            res.render('books/eachbook', { book: book, errmsg: "Error in deleting book" })
        }
        else {
            redirect('/')
        }
    }

})


// function to save cover image direct in database
function saveCover(book,encodedCover){
    if(encodedCover == null) return
    const cover = JSON.parse(encodedCover)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverimage = new Buffer.from(cover.data,'base64')
        book.coverimagetype = cover.type

    }
}

// common function for new and updating a book
async function renderNewBook(Book, res, form, haserror = false) {
    try {
        const authors = await Author.find()
        const params = {
            book: Book,
            authors: authors
        }
        if (haserror) {
            if (form == 'new') {
                params.errmsg = "Error occured while creating book "
            }
            else {
                params.errmsg = "Error occured while updating book"
            }
        }
        res.render(`books/${form}`, params)

    } catch {
        res.redirect('/books')
    }
}



module.exports = { router }