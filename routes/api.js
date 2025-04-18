'use strict';
const mongoose = require('mongoose');

module.exports = function (app) {

  //Connect to Database
  mongoose.connect(process.env.DB).then(() => {
    console.log("Connected to MongoDB");

    //Create Schema
    const Schema = mongoose.Schema;
    const bookSchema = new Schema({
      title: { type: String, required: true },
      comments: [String]
    });
    const BookModel = mongoose.model('BookModel', bookSchema);

    app.route('/api/books')
      .get(function (req, res){
        BookModel.find({})
        .then(array => {
          array.forEach(book => {
            book.commentcount = book.comments.length;
            delete book.comments;
          });
          res.send(array);
        });
      })
      
      .post(function (req, res){
        const newBook = { title: req.body.title, comments: [] };
        BookModel.create(newBook)
        .then(book => {
          newBook._id = book._id;
          console.log(newBook);
          res.send(newBook);
        });
      })
      
      .delete(function(req, res){
        BookModel.deleteMany({})
        .then(result => {
          res.send("complete delete successful");
        });
      });


    app.route('/api/books/:id')
      .get(function (req, res){
        BookModel.findById(req.params.id)
        .then(book => {
          if (!book) return res.send("no book exists");
          console.log(book);
          res.send(book);
        });
      })
      
      .post(function(req, res){
        if (!req.body.comment) return res.send("missing required field comment");
        BookModel.findById(req.params.id)
        .then(book => {
          if (!book) return res.send("no book exists");
          book.comments.push(req.body.comment)
          book.save().then(upBook => {
            console.log(upBook);
            res.send(upBook);
          });
        });
      })
      
      .delete(function(req, res){
        BookModel.findByIdAndDelete(req.params.id)
        .then(deletedBook => {
          if (!deletedBook) return res.send("no book exists");
          res.send("delete successful");
        });
      });

      //Query route for delete test
      app.get('/api/books/:id/exists', function(req, res) {
        BookModel.findById(req.params.id, function(err, book) {
          if (err) return res.status(500).send(err);
          if (book) return res.status(200).send(true);
          else return res.status(404).send(false);
        });
      });

  }).catch(err => {
    console.error('MongoSB connection error', err);
  });
};
