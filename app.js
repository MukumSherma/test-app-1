/**
 * Created by mukum on 24/6/15.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser')
    multer = require('multer'); //loading 'multer' module, it's a middleware that handles the file/image upload
var done = false;

var db = mongoose.connect('mongodb://localhost/bookAPI');

var Book = require('./models/bookModel');

var app = express();

var port = process.env.PORT || 3000; //takes either env or port

app.use(bodyParser.urlencoded({extented:true}));
app.use(bodyParser.json());
//bodyParse type is json, checks if post is json then it adds to "req.body"

bookRouter = require('./Routes/bookRoutes')(Book); //"()" executes the function

app.use('/api/books',bookRouter);
app.use('/api/authors',bookRouter);
//access in browser >localhost:3000/api/Books //books is case insensitive

//configure the multer
app.use(multer({
    dest: './uploads', //where the picture will be saved
    rename: function(fieldname, filename){
        return filename+Date.now;
    },
    onFileUploadStart: function(file){
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function(file){
        console.log(file.fieldname + ' uploaded to ' + file.path);
        done = true;
    }
}))

//handlin the routes
//....####...."/api/photo"....is the "action" attribute in html file
//http://localhost:8000/api/photo............link for uploading an image
app.post('/api/photo', function(req,res){
    if(done == true){
        console.log(req.files);
        res.end("File Uploaded");
    }
})

app.get('/', function(req, res){
    //res.send('Welcome to my Api');
    res.sendfile("index.html");
});

app.listen(port, function(){
    console.log('Running on Port : ' + port);
})