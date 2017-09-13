var express = require('express');
var app = express();
var path = require('path');
var error = Error('error');
var bodyParser = require('body-parser');
var pouchDB = require('pouchdb');

//Här skapas en lokal databas variabel
var database = new pouchDB("statistics");
//Här skickas krypterad data till couchDB databasen
var remoteCouch = new pouchDB("http://localhost:5984/statistics");

app.use(express.static(path.join(__dirname, 'public')));
//index route till servern
app.get('/', function (req, res) {
    if (!error) {
        console.log('Loaded...');
        res.send('index.html');
    } else {
        console.log("ERROR!");
    }

});

app.listen(4000, function (error) {
    if (!error) {
        console.log('Server is running on port 4000');
    }
});