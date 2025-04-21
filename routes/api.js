'use strict';
const mongoose = require('mongoose');

//Create Schema
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String]
});
const BookModel = mongoose.model('BookModel', bookSchema);


//Connect to Database
mongoose.connect(process.env.DB)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err =>console.error("MongoDB connection error" + err));

module.exports = function (app) {

  app.route('/api/books')
  .get(function (req, res){
    BookModel.find({})
    .then(array => {
      const result = array.map(book => {
        const obj = book.toObject();
        obj.commentcount = obj.comments.length;
        delete obj.comments;
        return obj;
      })
      res.send(result);
    });
  })
  
  .post(function (req, res){
    const title = req.body.title;
    if (!title) return res.send("missing required field title");
    BookModel.create({ title: title, comments: [] })
    .then(book => {
      res.send({ _id: book._id.toString(), title: book.title });
    }).catch(err => res.status(500).send("database error" + err));
  })
  
  .delete(function(req, res){
    BookModel.deleteMany({})
    .then(result => {
      res.send("complete delete successful");
    });
  });

  app.route('/api/books/:id')
  .get(function (req, res){
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.send("no book exists");
    BookModel.findById(id)
    .then(book => {
      if (!book) return res.send("no book exists");
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
    BookModel.findById(req.params.id)
    .then(book => {
      if (book) return res.status(200).send(true);
      else return res.status(404).send(false);
    });
  });
}
