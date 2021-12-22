var express = require('express');
var app = express();

app.get("/api/", (req, res) => {
    let now = Date.now();
    let date = new Date(now);
    let unixTime = date.getTime();
    let utcTime = date.toUTCString();
    res.send({ unix: unixTime, utc: utcTime });
});


app.get("/api/:time", (req, res) => {
    const { time } = req.params;
    const date = GetDate(time);
    let unixTime = date.getTime();    
    let utcTime = date.toUTCString();
    if (date.toString() === 'Invalid Date') {
        res.json({
            error: 'Invalid Date'
        });
    }
    else
        res.send({ unix: unixTime, utc: utcTime });
});

function GetDate(time) {
    if (time.match(/^\d+$/))
        return new Date(+time);
    else
        return new Date(time);
}


module.exports = app;

