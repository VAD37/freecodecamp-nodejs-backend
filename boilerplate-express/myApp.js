require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

GetTimeNow();

MiddlewareLogger();
BasicGet();
GetJson();
GetPublic();
EchoResponseWord();
ResponeName();
app.use("/name", bodyParser.urlencoded({ extended: false }), function (req, res) {
    const { first, last } = req.body;
    res.json({
        name: `${first} ${last}`
    });
});


function ResponeName() {
    app.get("/name", (req, res) => {
        const { first, last } = req.query;
        res.json({
            name: `${first} ${last}`
        });
    });
}

function EchoResponseWord() {
    app.get("/:word/echo", (req, res) => {
        const { word } = req.params;
        res.json({
            echo: word
        });
    });
}

function GetTimeNow() {
    app.get('/now', AddTimeToReq, SendJsonTime);
}

function SendJsonTime(req, res) {
    res.json({ time: req.time });
}

function AddTimeToReq(req, res, next) {
    req.time = new Date().toString();
    next();
}

function MiddlewareLogger() {
    app.use(function middleware(req, res, next) {
        console.log(req.method, req.path, "-", req.ip);
        next();
    });
}

function GetPublic() {
    app.use("/public", express.static(__dirname + "/public"));
}

function GetJson() {
    let jsonData = { "message": "Hello json" };
    app.get("/json", (req, res) => {
        if (process.env.MESSAGE_STYLE == "uppercase") {
            jsonData.message = jsonData.message.toUpperCase();
        }
        else {
            jsonData.message = "Hello json";
        }
        res.json(jsonData);
    });
}

function BasicGet() {
    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/views/index.html");
    });
}































module.exports = app;
