var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var { nanoid } = require('nanoid');
var mongoose = require('mongoose');
const WebUrl = 'https://test.vad37.com/api/shorturl/';

// configure the app to use bodyParser()
SetupApp();
AllowCORSfromFreeCodeCamp();

function SetupApp() {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
}

function AllowCORSfromFreeCodeCamp() {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

const UrlShort = SetupDatabaseSchema();
function SetupDatabaseSchema(){
    // Use mongo database since I already have a database. 
    // It is not a necessary for this test. Just a hot memory variable also works for this test.
    
    const { Schema } = mongoose;    
    var uri = process.env.MONGO_URI;
    mongoose.connect(uri, { useNewUrlParser: true });
    const shortenUrlSchema = new Schema({
        _id: String,
        original_url: String
    });
    const UrlShort = mongoose.model('UrlShort', shortenUrlSchema);
    return UrlShort;
}



PostShortUrl();
// Just use normal 4 char for url link. Does not consider the case of collision.
function PostShortUrl() {
    app.post('/api/shorturl/', (req, res) => {
        if (!IsUrlValid(req)) {
            res.json({ error: 'invalid url' });
            return;
        }

        const original_url = req.body.url;
        const _id = nanoid(4);
        const short_url = _id; // I do not know why short_url is only the id part and not the full url with https.
        const newUrl = new UrlShort({ _id, original_url, short_url });
        
        newUrl.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.json({ original_url, short_url, _id });
                console.log(_id);
            }
        });
    });
}

function IsUrlValid(req) {
    if (!Boolean (req.body) || !Boolean(req.body.url)) 
        return false;
    return req.body.url.toString().match(/^(http|https):\/\//);
}


GetUrlAndRedirect();

function GetUrlAndRedirect() {
    app.get('/api/shorturl/:id', (req, res) => {
        const _id = req.params.id;
        console.log(req.body);
        console.log(req.params);
        UrlShort.findOne({ _id }, (err, url) => {
            if (err) {
                res.send(err);
            } else {
                console.log(_id+ " redirecting to " + url.original_url);                
                res.redirect(301,url.original_url);
            }
        });
    });
}













module.exports = app;