const express = require("express");
const router = express.Router();



const listRouter = require('./list');
const createBookRouter = require('./book-create');
const updateBookRouter = require('./book-update');
const deleteBookrouter = require('./book-delete');

router.use('/', listRouter);
router.use('/', createBookRouter);
router.use('/', updateBookRouter);
router.use('/', deleteBookrouter);

module.exports = router;