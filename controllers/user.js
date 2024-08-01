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




// show each individual list
router.get('/list/:listId', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id).populate('lists.books');
    const list = currentUser.lists.id(req.params.listId);

    // Extract the book details for the books in the list
    const bookDetails = await Promise.all(list.books.map(async (bookId) => {
      const book = await Book.findById(bookId);
      return {
        title: book.title,
        author: book.author,
        editions: book.editions
      };
    }));

    res.render('nUser/listShow.ejs', {list,bookDetails});
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

//show add book to list page
router.get('/listAdd/:listId', async (req, res, next)=> {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const lists = currentUser.lists;
    const books = await Book.find({});

    res.render('nUser/addListBook.ejs', {
      lists: lists.id(req.params.listId),
      books
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

//actually add book to list
router.post('/list/:listsId', async (req, res, next) => {
  try{
    const currentUser = await User.findById(req.session.user._id);
    const lists = currentUser.lists.id(req.params.listsId);

    const book = lists.books.push(req.body.books);

    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/nUser/indexList`);

  }catch(error){
    console.error(error);
    res.redirect('/');
  }

})

//show list with books
// router.get('/indexList/:listsId', async (req, res, next)=> {

//   const currentUser = await User.findById(req.session.user._id);
//   const Lists = currentUser.lists.id(req.params.listsId);
//   const books = await currentUser.Lists.books.find({});



//   res.render('nUser/listShow',{
//     lists: Lists.id(req.params.listsId),
//     books })
// })



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