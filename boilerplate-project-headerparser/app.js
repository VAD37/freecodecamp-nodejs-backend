var express = require('express');
var app = express();
const bent = require('bent')
const getJSON = bent('json')


const softwareName = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
const language = "en-us";
let ip = null;

AllowCORSfromFreeCodeCamp();

function AllowCORSfromFreeCodeCamp() {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

app.get("/api/whoami/", async (req, res) => {
    let ip = await GetCurrentOrCacheIP();
    
    res.send({ipaddress:ip, language:language,software: softwareName});
});



module.exports = app;

async function GetCurrentOrCacheIP() {
    if(ip == null)
        ip = await getJSON('https://api.ipify.org?format=json').ip;
    return ip;
}

