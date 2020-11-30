const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')


// get all authors 
router.get('/', async (req, res) => {
    try {
        const authors = await Author.find()
        res.render('authors/all', { authors: authors })

    } catch {
        res.redirect('/')
    }

})

// route to handle form to create new author
router.get('/new', (req, res) => {
    res.render('authors/new')
})

// handling post to create new author
router.post('/', async (req, res) => {
    try {
        const data = new Author({
            name: req.body.author
        })
        await data.save()
        res.redirect('authors')
    }
    catch (e) {
        console.log(e)

        res.render('authors/new', { errmsg: "Some error has occured in creating author" })
    }

})

// get the individual author
router.get('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        let books = await Book.find({ author: req.params.id })

        res.render('authors/each', { author: author, books: books })

    } catch {
        let authors = await Author.find()
        if (author != null) {
            res.render('authors/all', { authors: authors, errmsg: "Some error occur in retriving author" })
        }
        else {
            res.redirect('/')
        }

    }

})

// updating author
router.put('/:id', async (req, res) => {
    let author
    const books = await Book.find({author:req.params.id})
    
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.render('authors/each', { author: author, books: books })

    } catch {
        if (author != null) {
            res.render('authors/each', { author: author, books: books, errmsg: "Some error has occured in updating author" })

        }
        else{
            res.redirect('/')
        }

    }
})


// for deleting author
router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors/')

    } catch (e) {
        console.log(e)

        if (author != null) {
            let book = await Book.find({ author: req.params.id })
            res.render('authors/each', { author: author, books: book })
        }
        else {
            res.redirect('/')
        }

    }
})


module.exports = { router }