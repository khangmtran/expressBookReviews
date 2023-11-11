const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router(); 
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const userName = req.body.userName;
  const password = req.body.password;
  if(userName){
    if(isValid(userName)){
      users.push({"userName":userName,"password":password});
      res.send("Register Successfully");
    }else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  for(const book in books){
    if(book === isbn){
      res.send(JSON.stringify(books[isbn]));
    }
  }
  res.send("No Book Found!");
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let {author} = req.params;
  for(const book in books){
    if(author === books[book].author){
      res.send(JSON.stringify(books[book]));
    }
  }
  res.send("No Book Found!");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let {title} = req.params;
  for(const book in books){
    if(title === books[book].title){
      res.send(JSON.stringify(books[book]));
    }
  }
  res.send("No Book Found!");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let {isbn} = req.params;
  for(const book in books){
    if(isbn === book){
      res.send(JSON.stringify(books[book].reviews));
    }
  }
  res.send("No Book Found!");
});

const connectToURL =  async(url) => {
  const outcome = await axios.get(url);
  let listOfEntries =  outcome.data;
  console.log(listOfEntries);
}

connectToURL("http://localhost:5000/");

const getBookByIsbn = async (url, isbn) => {
    const outcome = await axios.get(url);
    const books = outcome.data;

    // Search for the book by ISBN
    const foundBook = books[isbn];

    if (foundBook) {
      console.log("Found Book:");
      console.log(`Author: ${foundBook.author}`);
      console.log(`Title: ${foundBook.title}`);
      console.log(`Reviews:`, foundBook.reviews);
    } else {
      console.log("Book not found.");
    }
  };

getBookByIsbn("http://localhost:5000/", 1);

const getBooksByAuthor = async (url, authorName) => {
    const outcome = await axios.get(url);
    const books = outcome.data;

    // Find all books by the author
    const foundBooks = Object.values(books).filter(book => book.author === authorName);

    if (foundBooks.length > 0) {
      console.log(`Found ${foundBooks.length} book(s) by ${authorName}:`);
      foundBooks.forEach(book => {
        console.log(`Title: ${book.title}`);
        console.log(`Reviews:`, book.reviews);
      });
    } else {
      console.log("No books found by this author.");
    }
  
};

getBooksByAuthor("http://localhost:5000/", "Jane Austen");

const getBooksByTitle = async (url, bookTitle) => {
    const outcome = await axios.get(url);
    const books = outcome.data;
    const foundBooks = Object.values(books).filter(book => book.title === bookTitle);

    if (foundBooks.length > 0) {
      console.log(`Found ${foundBooks.length} book(s) with the title "${bookTitle}":`);
      foundBooks.forEach(book => {
        console.log(`Author: ${book.author}`);
        console.log(`Reviews:`, book.reviews);
      });
    } else {
      console.log("No books found with this title.");
    }
};

getBooksByTitle("http://localhost:5000/", "Pride and Prejudice");




module.exports.general = public_users;
