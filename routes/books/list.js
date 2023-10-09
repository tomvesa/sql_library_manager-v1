var express = require('express');
var router = express.Router();
const Book = require('../../models').Book;
const createError = require('http-errors');
const { Op } = require("sequelize");
const asyncHandler = require(`../../middleware/asyncHandler`);


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
  

  module.exports = router;