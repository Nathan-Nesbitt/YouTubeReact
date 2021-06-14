var chaiHttp = require('chai-http');
var chai = require("chai")
var app = require("../src/server")

chai.use(chaiHttp);
chai.should();


describe("App Endpoints", function() {
    describe("Get views from channelName", function() {
        it("Returns the views for newest video for a channel.", function() {
        chai.request(app)
            .get('/youtube/tseries')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            });
        });

        it("Fails to return the views for the newest video for a channel.", function() {
            chai.request(app)
                .get('/youtube/oajiwdjoawijdaowijdoaiiwjdoiawjdoiawjdoiajwdwa')
                .end((err, res) => {
                    res.should.have.status(400);
                });
            });
    });
});