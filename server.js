// include express and store instance of expres in app

var express = require('express');
var app = express();


// formidable to handle inputs and uploads
// tell app to use formidable
var formidable = require('express-formidable');
app.use(formidable());

//include mongodb
// create a mongo client object
// create an object id so each document(record) has an object id
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

//create http server
//Iinclude bcrypt to handle the plain text file 
// include file system to save the file
var http = require('http').createServer(app);
var bcrypt = require('bcrypt');
var filesystem = require('fs');

//JSON webtoken to create access token
// requires an access token string
var jsw = require('jsonwebtoken');
var accessTokenSecret = 'myAccessTokenSecret1234567890';

//tell server which folder we will be using
//set view engine
app.use('/ProSpects', express.static(__dirname + '/ProSpects'));
app.set('view engine', 'ejs');

// create instance of socket.io
// socket id for each user
// users array consisting of users
var socketIO = require('socket.io')(http);
var socketID ="";
var users = [];

//SET MAIN URL OF SERVER
var mainURL = 'http://localhost:3000';

//CONNECT WITH SOCKET IO
socketIO.on('connection',function (socket) {
    console.log('user connected',socket.id);
    socketID = socket.id;
})

//START THE SERVER
http.listen(3000, function () {
    console.log('server started');

    //CONNECT WITH DATABASE
    mongoClient.connect('mongodb://localhost:27017', function (error,client) {
        // database name
        var database = client.db('ProSpects');
        console.log('Database connected')

        // signup route which we will call when we access the sign up from url
        app.get('/signup',function (request,result){
            result.render('signup')
        })
    })
})
