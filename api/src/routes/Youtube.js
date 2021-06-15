/**
 * Some logic about the code, we first look for the channel, then we look
 * for the playlists (the videos), then we grab the video and get the stats.
 * 
 * These are separated into different functions to allow for better testing
 * and for clarity.
 * 
 * Nathan Nesbitt - 2021
 */


var express = require('express');
var router = express.Router();
const {google} = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
});

var getChannelUploadLocation = function(channelName) {
    return new Promise((success, failure) => {
        youtube.channels.list({
            part: 'id,snippet,contentDetails,statistics',
            forUsername: channelName
        }).then(response => {
            var channels = response.data.items;
            if (!channels || channels.length == 0)
                failure("No channels found")
            else
                success(channels[0].contentDetails.relatedPlaylists.uploads)
        })
    })
}

var getUploads = function(playlistId) {
    return new Promise((success, failure) => {
        youtube.playlistItems.list({
            maxResults: 10,
            part: ['id', 'status', 'snippet'],
            playlistId: playlistId
        }).then(response => {
            var channel_videos = response.data.items;
            if (!channel_videos || channel_videos.length == 0)
                failure("No videos found")
            else
                success(channel_videos)
        })
    })
}

var getVideoViews = function(videoID) {
    return new Promise((success, failure) => {
        youtube.videos.list({
            maxResults: 1,
            part: ['statistics', 'snippet'],
            id: videoID
        }).then(response => {
            var videos = response.data.items;
            if (!videos || videos.length == 0)
                failure("Video info not found")
            else
                success(videos[0].statistics.viewCount)
        })
    })
}

router.get('/:channelName', function(req, res, next) {
    var channelName = req.params.channelName;
    var channelID, channelName, videoID, numberOfViews;
    getChannelUploadLocation(channelName)
    .then(result => {
        console.log(result)
        return getUploads(result)
    })
    .then(result => {
        console.log(result[0].snippet.resourceId.videoId)
        return getVideoViews(result[0].snippet.resourceId.videoId)
    })
    .then(result => {
        res.send({
            success: true,
            data: {
                numberOfViews: result
            }
        })
    })
    .catch(err => {
        // Put this catch to make sure we don't dump errors with youtube details
        if(typeof err === "string")
            res.status(400).send({
                success: false,
                data: {
                    error: err
                }
            })
    })
});

module.exports = {
    router,
    getChannelUploadLocation, 
    getUploads, 
    getVideoViews
};