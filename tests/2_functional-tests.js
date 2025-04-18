/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      const titleTest = "LOTR";

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send(titleTest)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Test1: response should be an object');
          assert.property(res.body, 'title', 'Test1: title is missing');
          assert.equal(res.body.title, titleTest, 'Test1: title is wrong');
          assert.property(res.body, '_id', 'Book should contain _id');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'missing required field title', 'Test2: wrong response');
          done();
        });
      });
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Test3: response should be an array');
          res.body.forEach(function(book) {
            assert.property(book, 'title', 'Test3: missing title' );
            assert.property(book, '_id', 'Test3: missing _id');
            assert.property(book, 'commentcount', 'Test3: missing commentcount');
            assert.isNumber(book.commentcount, 'Test3: commentcount is not number type');
            });
          done();
        });      
      });
    });
    
    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/idInvalid')
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'no book exists', 'Test4: wrong response');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/idValid')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'Test5: response should be an object');
          assert.property(res.body, 'title', 'Test5: title error' );
          assert.property(res.body, '_id', 'Test5: _id error');
          assert.property(res.body, 'comments', 'Test5: comment error');
          assert.isArray(res.body.comments, 'Test5: comments is not an array');
        done();
        });    
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        //done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        //done();
      });

    });

  });

});
