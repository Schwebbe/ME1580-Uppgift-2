// Här skapas alla moduler som har installerats via npm
var express = require('express');
var app = express();
var path = require('path');
var error = Error('error');
var bodyParser = require('body-parser');
var pouchDB = require('pouchdb');

//Här skapas en lokal databas variabel
var database = new pouchDB("http://localhost:5985/images");

app.use(express.static(path.join(__dirname, 'public')));
//Här används en json-tolkare
app.use(bodyParser.json());
//Man skapar en urlencoded tolkare
app.use(bodyParser.urlencoded({
    extended: true
}));
//index route till servern
app.get('/', function (req, res) {
    if (!error) {
        console.log('Loaded...');
        res.send('admin.html');
    } else {
        return res.status(400).send({
            "status": "error",
            "message": "An `id` is required"
        });
    }

});
//Kör alla databas variabler och inkludera alla dokument som ska vara = sant
app.get("/images", function (req, res) {
    database.allDocs({
        include_docs: true
    }).then(function (result) {
        res.send(result.rows.map(function (item) {
            return item.doc;
        }));
    }, function (error) {
        res.status(400).send(error);
    });
});
//Här postas ny data till routen customers och svarar med resultatet från databasen
app.post("/images", function (req, res) {
    database.post(req.body).then(function (result) {
        //Detta kommando gör så att när post requesten skickas itll servern, so respondar den med
        //att refresha sidan via detta direktiv som anges
        res.sendFile((path.join(__dirname, '/public/admin.html')));
    });
});
//Här tas data bort från customers och returnerar resultaten från databasen 
app.delete("/images/:id", function (req, res) {
    database.get(req.params.id).then(function (result) {
        return database.remove(result);
    }).then(function (result) {
        res.send(result);
    });
});

//Här uppdateras customers kolumnen och returnerar nya ändringar som har gjorts
app.put("/images/:id", function (req, res) {
    database.get(req.body.id).then(function (result) {
        result.title = req.body.title;
        result.subtext = req.body.subtext;
        result.image = req.body.image;
        database.put(result);
        res.send(result);
    });
});
app.listen(4000, function (error) {
    if (!error) {
        console.log('Server is running on port 4000');
    }
    else {
        console.log('ERROR!');
    }
});
