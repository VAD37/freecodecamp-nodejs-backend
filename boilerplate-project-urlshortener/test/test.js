// The Mocha test copy directly from https://github.com/freeCodeCamp/freeCodeCamp/blob/main/curriculum/challenges/english/05-back-end-development-and-apis/back-end-development-and-apis-projects/timestamp-microservice.md
const request = require('supertest');
var assert = require('assert');
var app = require('../app');

describe('You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties.'
    , async () => {
        const full_url = 'https://www.google.com/' + Date.now();
        
        it('Should be a valid url and original = ' + full_url, (done) => {
            request(app).post('/api/shorturl')
                .send({url: full_url})
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.notEqual(res.body, null);
                    assert.notEqual(res.body.short_url, null);
                    assert.equal(res.body.original_url, full_url);
                    done();
                });
        });
    })

describe("When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.", () => {
    const agent = request.agent(app);
    const full_url = 'https://www.google.com/ ' + Date.now();
    it('Should return original URL', async (done) => {
        const response = await agent.post('/api/shorturl')
            .send({ url: full_url })
            .expect(200);
        agent.get('/api/shorturl/' + response.body.short_url)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.redirected, true);
                assert.equal(res.body.url, full_url);
                done();
            })
    });
})

describe("If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }", ()=>{
    const agent = request.agent(app);
    it('Should return invalid url', (done)=>{
        agent
        .post('/api/shorturl')
        .send({ url: 'wrongformat://ssadas' })
        .expect(200)
        .end((err, res)=>{
            if(err) return done(err);
            assert.equal(res.body.error.toLowerCase(), 'invalid url');
            done();
        });
    });
})