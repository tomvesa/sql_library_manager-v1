const express = require('express');
const router = express.Router();
const Book = require("../../models").Book;
const asyncHandler = require('../../middleware/asyncHandler');


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