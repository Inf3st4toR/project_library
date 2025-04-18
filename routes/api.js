'use strict';
const mongoose = require('mongoose');

module.exports = function (app) {

  //Connect to Database
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
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
        //response will be array of book objects
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      })
      
      .post(function (req, res){
        let title = req.body.title;
        //response will contain new book object including atleast _id and title
      })
      
      .delete(function(req, res){
        //if successful response will be 'complete delete successful'
      });



    app.route('/api/books/:id')
      .get(function (req, res){
        let bookid = req.params.id;
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      })
      
      .post(function(req, res){
        let bookid = req.params.id;
        let comment = req.body.comment;
        //json res format same as .get
      })
      
      .delete(function(req, res){
        let bookid = req.params.id;
        //if successful response will be 'delete successful'
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
