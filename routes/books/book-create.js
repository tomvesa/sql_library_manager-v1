const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const asyncHandler = require("../../middleware/asyncHandler");

/* Create a new-book  form. */
router.get('/new', (req, res) => {
    res.render("books/new-book", { book: {}, title: "New Book" });
  });
  
  /* POST create book. */
  router.post('/new', asyncHandler(async (req, res) => {
    let book;
    try {
       book = await Book.create(req.body);
      res.redirect( "/books/" );
  
    } catch (error){
      if(error.name === "SequelizeValidationError"){
        book = await Book.build(req.body);
        // if error found send the error object to pug file to be displayed
        res.render("books/new-book", {book, errors: error.errors, title: "New Book"});
      } else {
        throw error; 
      }
    }
  }));

  module.exports = router;