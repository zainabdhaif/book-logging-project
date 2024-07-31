const express = require('express');

const router = express.Router();

const User = require('../models/user.js');
const Book = require('../models/book.js');


//all books page
router.get('/index', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const books = await Book.find({});

      // const books = currentUser.books.id(bookList);
      res.render('books/index.ejs', {books});

    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

//add new book page
router.get('/new', async (req, res) => {
    res.render('books/new.ejs');
});


//book is created and added to db
router.post('/', async (req, res, next) => {
  try{
    const currentUser = await User.findById(req.session.user._id);


    req.body.date = new Date(req.body.date);

    const newBook = {
      title:req.body.title,
      author:req.body.author,
      averageRating: req.body.averageRating,
    };

    const book = await Book.create(newBook);

    const bookId = book._id;
    const bookEd = await Book.findById(bookId);

    const editionData = {
      publishingHouse: req.body.publishingHouse,
      datePublished: req.body.datePublished,
      language: req.body.language,
      noOfPages: req.body.noOfPages,
      bookCover: req.body.bookCover
    };

    const edition = bookEd.editions.push(editionData);
    await bookEd.save();

    currentUser.books.push(book._id);
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/books/index`);

  }catch (error){
    console.error(error);

    res.redirect('/');
  }
});

//show each individual book
router.get('/:bookId', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);
 
    res.render('books/show.ejs', {book});

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

//edit each individual book
router.get('/:bookId/edit', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);
    const edition =book.editions.find( edition => {
      return edition
    }
    );
    res.render('books/edit.ejs', {book, edition});

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

//actually edit a book
router.put('/:bookId', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    req.body.date = new Date(req.body.date);
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body);
    

    res.redirect(`/users/${currentUser._id}/books/${book._id}`);


    
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});


//delete a book
router.delete('/:bookId', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    currentUser.books.pull(req.params.bookId);
    await currentUser.save();
    // Delete the book from the database
    await Book.findByIdAndDelete(req.params.bookId);

    res.redirect('/books/index.ejs');
  } catch (error) {
    console.log(error);

    res.redirect('/');
  }
});
module.exports = router; 


