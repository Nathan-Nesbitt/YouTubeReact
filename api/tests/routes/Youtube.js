const { assert } = require("chai");
var should = require('chai').should();
var chai = require("chai")
var {getChannelUploadLocation, getUploads, getVideoViews} = require("../../src/routes/Youtube")


describe("Youtube Functions", function() {
    describe("Gets the channel upload location.", function() {
        it("Gets a real channel's upload location", function(done) {
            getChannelUploadLocation("tseries")
            .then(done())
        });

        it("Fails to get a non-real channel upload location.", function(done) {
            getChannelUploadLocation("987awdgh98awgd876agdw897awg978g8awd9aw87dg9a8wdg")
            .then()
            .catch(err => {
                assert.equal(err, "No channels found")
                done()
            })
        });
    });

    describe("Gets the uploads for an account.", function() {
        it("Successfully gets a real upload ID's videos", function(done) {
            getUploads("UUq-Fj5jknLsUf-MWSy4_brA")
            .then(res => {
                should.exist(res);
                res.should.have.length(10);
                done()
            })
        });

        it("Successfully handles non real upload ID.", function() {
            getUploads("987awdgh98awgd876agdw897awg978g8awd9aw87dg9a8wdg")
            .then()
            .catch(err => {
                assert.equal(err, "No videos found")
                done()
            })
        });
    });

    describe("Gets the views for a specific video.", function() {
        /**
         * Thought I would comment on the reason it is not run.
         * 
         * The following is the test for this function, it is 
         * currently erroring due to an issue with the Youtube API not keeping
         * the same value for a video between requests. I think this is a bug,
         * as the rest of the API does not do this. Following up on GitHub with
         * a ticket. 
         * 
        it("Successfully gets a real video ID's views", function(done) {
            getVideoViews("FSxW--qwUhA")
            .then(res => {
                done()
            })
        });
        */

        it("Successfully handles non real video ID.", function() {
            getVideoViews("987awdgh98awgd876agdw897awg978g8awd9aw87dg9a8wdg")
            .then()
            .catch(err => {
                assert.equal(err, "Video info not found")
                done()
            })
        });
    });
});