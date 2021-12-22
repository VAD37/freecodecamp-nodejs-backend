// The Mocha test copy directly from https://github.com/freeCodeCamp/freeCodeCamp/blob/main/curriculum/challenges/english/05-back-end-development-and-apis/back-end-development-and-apis-projects/timestamp-microservice.md
const request = require('supertest');
var assert = require('assert');
var app = require('../app');
describe("A request to /api/:date? with a valid date should return a JSON object with a unix key that is a Unix timestamp of the input date in milliseconds", ()=>{
    const agent = request.agent(app);
    it('Should be a valid unix timestamp', (done)=>{
        agent
        .get('/api/2016-12-25')
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            assert.equal(res.body.unix, 1482624000000);
            done();
        });
    });
})

describe("A request to /api/:date? with a valid date should return a JSON object with a utc key that is a string of the input date in the format: Thu, 01 Jan 1970 00:00:00 GMT"
, ()=>{
    const agent = request.agent(app);
    it('Should be a valid utc string', (done)=>{
        agent
        .get('/api/2016-12-25')
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            assert.equal(res.body.utc, "Sun, 25 Dec 2016 00:00:00 GMT");
            done();
        });
    });    
})

describe('A request to /api/1451001600000 should return { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }',
()=>{
    const agent = request.agent(app);
    it('Should be a valid unix, utc', (done)=>{
        agent
        .get('/api/1451001600000')
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            assert.equal(res.body.unix, 1451001600000);
            assert.equal(res.body.utc , 'Fri, 25 Dec 2015 00:00:00 GMT');
            done();
        });
    });
})

describe('Your project can handle dates that can be successfully parsed by new Date(date_string)',
()=>{
    const agent = request.agent(app);
    it('Should be a valid unix, utc', (done)=>{
        agent
        .get('/api/05 October 2011, GMT')
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            assert.equal(res.body.unix, 1317772800000 );
            assert.equal(res.body.utc , 'Wed, 05 Oct 2011 00:00:00 GMT');
            done();
        });
    });
})

describe('If the input date string is invalid, the api returns an object having the structure { error : "Invalid Date" }', 
()=>{
    const agent = request.agent(app);
    it('Should return error Invalid Date', (done)=>{
        agent
        .get('/api/asdf')
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            assert.equal(res.body.error.toLowerCase(), 'invalid date');
            done();
        });
    });
})

describe('An empty date parameter should return the current time in a JSON object with a unix key', 
()=>{
    const agent = request.agent(app);
    var now = Date.now();
    it('Should return current time', (done)=>{
        agent
        .get('/api/')
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            assert(now - res.body.unix < 20000);
            done();
        });
    });
}
)

describe('An empty date parameter should return the current time in a JSON object with a utc key', 
()=>{
    const agent = request.agent(app);
    var now = Date.now();
    it('Should return current time', (done)=>{
        agent
        .get('/api/')
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            var serverTime = new Date(res.body.utc).getTime();
            assert(now - serverTime < 20000);
            done();
        });
    });
}
)