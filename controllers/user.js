const express = require('express');

const router = express.Router();

const User = require('../models/user.js');
const Book = require('../models/book.js');

//show all books
router.get('/index',async (req,res,next)=> {
    try{
        const books = await Book.find({});
        res.render('nUser/index.ejs', {books});


    }catch (error){
 console.log(error);
      res.redirect('/');
    }
})

//add new list page
router.get('/newList',async (req,res,next)=> {
  try{

    res.render('nUser/newList.ejs');


  }catch (error){
console.log(error);
    res.redirect('/');
  }
})

//see all lists page 
router.get('/indexList',async (req,res,next)=> {
  try{
    const currentUser = await User.findById(req.session.user._id);
    const lists = currentUser.lists;

    res.render('nUser/indexList.ejs', { lists });


  }catch (error){
console.log(error);
    res.redirect('/');
  }
})



//list is actually created and added to db
router.post('/', async (req, res, next)=> {
  try{

    const currentUser = await User.findById(req.session.user._id);

    const listData = {
      listType: req.body.listType,
      description: req.body.description
    };

    const list = currentUser.lists.push(listData);
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/nUser/indexList`);

  }catch (error){
    console.error(error);

    res.redirect('/');
  }
});


//show each individual list
router.get('/:listId', async (req, res, next)=> {
  try{

    const currentUser = await User.findById(req.session.user._id);
    const lists = currentUser.lists;

    res.render('nUser/listShow.ejs', {
      lists: lists.id(req.params.listId)
    });

  }catch (error){
    console.error(error);
    res.redirect('/');
  }
})

router.get('/addListBook/:listId', async (req, res, next)=> {
  try{
    // const currentUser = await User.findById(req.session.user._id);
    // const lists = currentUser.lists;

    // res.render('nUser/addListBook.ejs', {
    //   lists: lists.id(req.params.listsId)
    // });

    res.render('nUser/addListBook.ejs')

  }catch (error){
    console.error(error);
    res.redirect('/');
  }
})

//show each individual book
router.get('/book/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);
 
    res.render('nUser/showBooks.ejs', {book});

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});



module.exports = router; 