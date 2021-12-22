require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: './uploads/' })
// configure the app to use bodyParser()
SetupApp();
AllowCORSfromFreeCodeCamp();
function SetupApp() {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
}

function AllowCORSfromFreeCodeCamp() {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

// You can submit a form that includes a file upload.
// The form file input field has the name attribute set to upfile.
app.post('/api/fileanalyse',upload.single('upfile'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send({name: req.file.originalname,type: req.file.mimetype,size: req.file.size});
});



module.exports = app;
