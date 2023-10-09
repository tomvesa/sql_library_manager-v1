var express = require('express');
var router = express.Router();



// other routes  
const booksRouter = require("./books/index");

router.use("/books", booksRouter)  


/* GET home page. */
/* GET home page. */
router.get('/', (req, res, next) => {
      res.redirect("/books")
  });



module.exports = router;
