require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// configure the app to use bodyParser()
SetupApp();
AllowCORSfromFreeCodeCamp();
const UserTracker = SetupDatabaseSchema();

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

function SetupDatabaseSchema() {
    // Use mongo database since I already have a database. 
    // It is not a necessary for this test. Just a hot memory variable also works for this test.

    const { Schema } = mongoose;
    var uri = process.env.MONGO_URI;
    mongoose.connect(uri, { useNewUrlParser: true });
    const exerciseSchema = new mongoose.Schema({
        description: String,
        duration: Number,
        date: Date
    });
    const userSchema = new Schema({
        username: String,
        exercises: [exerciseSchema]
    });
    return mongoose.model('UserExercise', userSchema);
}

// You can POST to /api/users with form data username to create a new user.
// If user already exists, you should return a JSON object containing a message and the _id of that user.
CreateOrGetUser();

// You can make a GET request to /api/users to get a list of all users. The list only contains the username and _id.
GetUserList();

// You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
// The response returned will be the user object with the exercise fields added.
PostExerciseToUser();

// You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
// A request to a user's log returns a user object with a count property representing the number of exercises that belong to that user.
// A GET request to /api/users/:id/logs will return the user object with a log array of all the exercises added.
// The log array contains the description, duration, and date of each exercise.
// You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
// If no from and to parameters are supplied, the entire log will be sent.
// If no limit is supplied, the default limit will be 10.
// If the user does not exist, you should return a 404 error.
GetUserLogs();


module.exports = app;

function GetUserLogs() {
    app.get('/api/users/:_id/logs', (req, res) => {
        var _id = req.params._id;
        var from = req.query.from || 0;
        var to = req.query.to || Date.now();
        var limit = req.query.limit || 100000;
        from = new Date(from);
        to = new Date(to);
        UserTracker.findById(_id, (err, user) => {
            if (err) {
                console.log(err);
                res.status(404).send(err);
            } else {
                var log = user.exercises.filter(exercise => {
                    return exercise.date >= from && exercise.date <= to;
                });
                log = log.slice(0, limit);
                // convert log to new array of objects with date, description, duration and format Date
                log = log.map(exercise => {
                    return {
                        description: exercise.description,
                        duration: exercise.duration,
                        date: (new Date(exercise.date)).toDateString(),
                    };
                });
                res.send({ _id: user._id, username: user.username, count: log.length, log });
            }
        });
    });
}

function PostExerciseToUser() {
    app.post('/api/users/:_id/exercises', (req, res) => {
        let { description, duration, date } = req.body;
        const { _id } = req.params;
        duration = Number(duration);
        date = GetOrFormatDate(date);
        let newExercise = { description, duration, date };
        UserTracker.findById(_id, (err, user) => {
            if (err) {
                res.status(500).send(err);
            } else {
                user.exercises.push(newExercise);
                user.save((err, user) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        let dateString = date.toDateString();
                        res.send({ _id: user._id, username: user.username, date: dateString, duration, description });
                    }
                });
            }
        });
    });
}

function GetOrFormatDate(date) {
    if (!Boolean(date))
        date = new Date();

    else
        date = new Date(date);
    return date;
}

function GetUserList() {
    app.get('/api/users/', (req, res) => {
        UserTracker.find({}, (err, users) => {
            if (err) {
                res.send(err);
            }
            let userList = [];
            users.forEach(user => {
                userList.push({
                    username: user.username,
                    _id: user._id
                });
            });
            res.json(userList);
        });
    });
}

function CreateOrGetUser() {
    app.post('/api/users/', (req, res) => {
        const { username } = req.body;
        if (!username) {
            res.status(400).send('username is required');
            return;
        }
        UserTracker.findOne({ username }, (err, user) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (user) {
                res.status(200).send({
                    message: 'user already exists',
                    username: user.username,
                    _id: user._id
                });
                return;
            }
            user = new UserTracker({
                username: username,
                exercises: []
            });
            user.save((err, data) => {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                res.send({ username: data.username, _id: data._id });
            });
        });
    });
}
