const express = require('express');
const router = express.Router();
const Book = require('../../models').Book;
const asyncHandler = require('../../middleware/asyncHandler');

// get individual book
// individual book is displayed as book edit form
router.get("/:id/", asyncHandler(async(req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
     res.render("books/update-book", { book, title: "Edit Book" })
    } else {
         next(createError(404, 'Not Found'));
 };
 }));
 
 /* Update an book. */
 router.post('/:id/', asyncHandler(async (req, res, next) => {
   let book;
 try {  
   book = await Book.findByPk(req.params.id);
   if(book){
   // update book and redirect to books listings  
   await book.update(req.body)
   res.redirect("/books" );
 } else {
   createError(404, 'Not Found');
 }} catch (error){
   // if there is a validation error, display message what the error is
   if(error.name === "SequelizeValidationError"){
     book = await Book.build(req.body);
     book.id =  req.params.id;
     res.render("books/update-book", {book, errors: error.errors, title: "Edit Book" })
   } else {
     throw error;
   }
 }
 }));
 

 module.exports = router;