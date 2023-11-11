const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
for(const user of users){
  if(username === user.userName){
    return false;
  }
}
return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
for(const user of users){
    if(username === user.userName && password === user.password){
      return true;
  }
}
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const userName = req.body.userName;
  const password = req.body.password;
  
  if (!userName || !password) {
    return res.status(404).json({message: "Error logging in"});
}
  if(authenticatedUser(userName, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,userName
  }
   return res.status(200).send("User successfully logged in")
  }

  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const userName = req.session.authorization.userName;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.reviews[userName]) {
    // If the user has already reviewed this book, update the existing review
    book.reviews[userName] = reviewText;
    return res.status(200).json({ message: "Review updated successfully", review: reviewText });
  } else {
    // If the user has not reviewed this book before, add a new review
    book.reviews[userName] = reviewText;
    return res.status(200).json({ message: "Review added successfully", review: book.reviews[userName] });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const userName = req.session.authorization.userName; // Get the logged-in username from the session
  
  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has reviewed this book
  if (books[isbn].reviews && books[isbn].reviews[userName]) {
    // Delete the user's review
    delete books[isbn].reviews[userName];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
