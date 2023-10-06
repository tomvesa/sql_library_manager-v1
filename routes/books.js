var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const createError = require('http-errors');
const { Op } = require("sequelize");

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

/* GET books listing. with pagination and search function*/
router.get('/', asyncHandler(async (req, res) => {
  let {search : searchQuery = "", 
       page :currentPage = 1 } =  req.query ;

  const limit = 5;
  let booksCount = 0;
  let pages = 1;
  let books;

  // object for preparing a Sequelize call into the database
  // default settings entries per page, offset  and sorting
  // with search setting conditions to be met
  const databaseCallConfig = {
    default: {
      limit: limit,
      offset: currentPage * limit - limit,
      order: [["title", "ASC"]]
    },
    withSearch: {
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${searchQuery}%`
            }
          },
          {
            author: {
              [Op.like]: `%${searchQuery}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${searchQuery}%`
            }
          },
          {
            year: {
              [Op.like]: `%${searchQuery}%`
            }
          }
        ]
      }

    }
  }
  // without a search return all books and count of pages
  if(!searchQuery){
   books = await Book.findAll({...databaseCallConfig.default})
   booksCount = await Book.count();
   pages = Math.ceil(booksCount / limit)
  // with search return filtered entries and count of pages 
} else {
  books = await Book.findAll({...databaseCallConfig.default, ...databaseCallConfig.withSearch});
  booksCount = await Book.count({...databaseCallConfig.withSearch});
  pages = Math.ceil(booksCount / limit);

}
// render books/index pug file with book object, search info and pagination information
  res.render("books/index", { books, title: "Books", booksCount, searchQuery, currentPage, pages });
}));



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




// display individual book
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