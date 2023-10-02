var express = require('express');
var router = express.Router();
const createError = require('http-errors');


/* GET home page. */
/* GET home page. */
router.get('/', (req, res, next) => {
  
    res.redirect("books")
  
});


router.get('/users', (req, res, next) =>{
  res.redirect('books');
})





module.exports = router;
