var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const createError = require('http-errors');

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["createdAt", "DESC"]]});
  res.render("books/index", { books, title: "Books" });
}));

/* Create a new book form. */
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
      res.render("books/new-book", {book, errors: error.errors, title: "New Book"});
    } else {
      throw error; 
    }
  }
}));





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
  console.log("book update: ", book);
  if(book){
  await book.update(req.body)
  res.redirect("/books" );
} else {
  createError(404, 'Not Found');
}} catch (error){
  if(error.name === "SequelizeValidationError"){
    book = await Book.build(req.body);
    book.id =  req.params.id;
    res.render("books/update-book", {book, errors: error.errors, title: "Edit Book" })
  } else {
    throw error;
  }
}
}));


 

/* Delete individual article. */
router.post('/:id/delete', asyncHandler(async (req ,res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
  await book.destroy();
  res.redirect("/books");
} else {
  res.sendStatus( 404);
}
}));




module.exports = router;