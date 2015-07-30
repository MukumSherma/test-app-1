/**
 * Created by mukum on 25/6/15.
 */

var express = require('express');
var routes;
routes = function (Book) {  //Pass the Book model
    var bookRouter = express.Router();

    /*.....working codes......
     bookRouter.route('')
     .post(function (req, res) { //posting book details
     var book = new Book(req.body); //gets an instance of a "Book" model
     book.save(); //save book details in MongoDb
     res.status(201).send(book); //send back status code
     console.log(book);
     res.send(book);
     })
     .get(function (req, res) {
     //var responseJson = {hello:"This is my api"};
     //res.json(responseJson);//sends back "json"
     //res.remder();//sends back "html"

     //var query = req.query; //request query

     //var query = req.query;

     //find by genre
     //eg -> localhost:8000/api/books?genre=Science Fiction
     var query = {};

     //filters only by author
     //if(req.query.author){
     //    //filters results by genre only, other than that, it just outputs the original content
     //    query.genre = req.query.author;
     //}

     //filters only by genre
     if (req.query.genre) {
     //filters results by genre only, other than that, it just outputs the original content
     query.genre = req.query.genre;
     }

     Book.find(query, function (err, books) {
     if (err) {
     res.status(500).send(err);
     //console.log(err);
     }
     else {
     res.json(books);
     }
     })

     bookRouter.route('/:bookId')
     .get(function (req, res) {

     //find by a bookId
     //eg. -> http:localhost:8000/api/books/13434344
     Book.findById(req.params.bookId, function (err, book) {
     if (err) {
     res.status(500).send(err);
     //console.log(err);
     }
     else {
     res.json(book);
     }
     })
     })
     .put(function (req, res) {

     //find by a bookId
     //eg. -> http:localhost:8000/api/books/13434344
     Book.findById(req.params.bookId, function (err, book) {
     if (err) {
     res.status(500).send(err);
     //console.log(err);
     }
     else {
     //if there is some changes
     //if you miss some fields then it still can put/post but the field is deleted
     book.title = req.body.title;
     book.author = req.body.author;
     book.genre = req.body.genre;
     book.read = req.body.read;
     book.save();
     res.json(book);
     }
     });
     });

     });
    */ //workig code

    bookRouter.route('/')
        .post(function (req, res) { //posting book details
            var book = new Book(req.body); //gets an instance of a "Book" model
            book.save(); //save book details in MongoDb
            res.status(201).send(book); //send back status code
            console.log(book);
            res.send(book);
        })
        .get(function (req, res) {
            //var responseJson = {hello:"This is my api"};
            //res.json(responseJson);//sends back "json"
            //res.remder();//sends back "html"

            //var query = req.query; //request query

            //var query = req.query;

            //find by genre
            //eg -> localhost:8000/api/books?genre=Science Fiction
            var query = {};

            //filters only by author
            //if(req.query.author){
            //    //filters results by genre only, other than that, it just outputs the original content
            //    query.genre = req.query.author;
            //}

            //filters only by genre
            if (req.query.genre) {
                //filters results by genre only, other than that, it just outputs the original content
                query.genre = req.query.genre;
            }

            Book.find(query, function (err, books) {
                if (err) {
                    res.status(500).send(err);
                    //console.log(err);
                }
                else {
                    res.json(books);
                }
            });

        });

    //appying a middleware , used for 'patch' function
    // 'patch' only updates a specific field but also keeps the remaining fields
    bookRouter.use('/:bookId',function(req,res,next){
        //find by a bookId
        //eg. -> http:localhost:8000/api/books/13434344
        Book.findById(req.params.bookId, function (err, book) {
            if (err) {
                res.status(500).send(err);
                //console.log(err);
            }
            else if(book){ //if book is found
                req.book = book;
                next();
            }
            else {
                res.status(404).send('no book found');
            }
        });
    });

    bookRouter.route('/:bookId')
        .get(function (req, res) {

            res.json(req.book);

        })
        .put(function (req, res) {
            //if there is some changes
            //if you miss some fields then it still can put/post but the field is deleted
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(function(err) {
                if (err) {
                console.log("Error is found");
                res.status(500).send(err);
            }
                else
                    res.json(req.book);
            });
        })
        .patch(function(req,res){
            if(req.body._id)
                delete req.body._id;
            for(var p in req.body)
            {
                req.book[p] = req.body[p];
            }
            req.book.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(req.book);
            });
        })
        .delete(function(req,res){
            req.book.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else
                    res.status(204).send('Removed');
            })
        })

    return bookRouter;
};

module.exports = routes;
