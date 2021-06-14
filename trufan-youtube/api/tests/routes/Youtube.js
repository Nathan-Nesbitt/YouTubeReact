var chai = require("chai")
var {getChannelUploadLocation, getUploads, getVideoViews} = require("../../src/routes/Youtube")


describe("Youtube Functions", function() {
    describe("Gets the upload ID based on the channel name.", function() {
        it("Returns the views for newest video for a channel.", function() {
        chai.assert(getChannelUploadLocation("tseries"))
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