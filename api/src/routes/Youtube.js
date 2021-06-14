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
    auth: 'AIzaSyD3g_ekVZLfUT5iVHUW9rOLGHv6ZkEXzhs'
});

var getChannelUploadLocation = function(channelName) {
    return new Promise((success, failure) => {
        youtube.channels.list({
            part: 'id,snippet,contentDetails,statistics',
            forUsername: channelName
        }).then(response => {
            var channels = response.data.items;
            if (channels.length == 0)
                failure("No channels found")
            else
                success(channels[0].contentDetails.relatedPlaylists.uploads)
        })
    })
}

var getUploads = function(channelName) {
    return new Promise((success, failure) => {
        youtube.playlistItems.list({
            maxResults: 10,
            part: ['id', 'status', 'snippet'],
            playlistId: channels[0].contentDetails.relatedPlaylists.uploads
        }).then(response => {
            var channel_videos = response.data.items;
            if (channel_videos.length == 0)
                failure("No videos found")
            else
                success(channel_videos)
        })
    })
}

var getVideoViews = function(channelName) {
    return new Promise((success, failure) => {
        youtube.videos.list({
            maxResults: 1,
            part: ['statistics', 'snippet'],
            id: channel_videos[0].snippet.resourceId.videoId
        }).then(response => {
            var channels = response.data.items;
            if (channels.length == 0)
                failure("Video info not found")
            else
                success(channels[0].contentDetails.relatedPlaylists.uploads)
        })
    })
}

router.get('/:channelName', function(req, res, next) {
    var channelName = req.params.channelName;
    youtube.channels.list({
        part: 'id,snippet,contentDetails,statistics',
        forUsername: channelName
    }).then(response => {
        var channels = response.data.items;
        if (!channels || channels.length == 0) {
            res.status(400).send({
                success: false,
                data: {
                    error: "No channel found."
                }
            })
        } 
        else {
            youtube.playlistItems.list({
                maxResults: 10,
                part: ['id', 'status', 'snippet'],
                playlistId: channels[0].contentDetails.relatedPlaylists.uploads
            }).then(response => {
                var channel_videos = response.data.items;
                youtube.videos.list({
                    maxResults: 10,
                    part: ['statistics', 'snippet'],
                    id: channel_videos[0].snippet.resourceId.videoId
                }).then(response => {
                    res.send({
                        success: true,
                        data: {
                            channelID: channels[0].id,
                            channelName: channels[0].snippet.title,
                            videoID: channel_videos[0].snippet.resourceId.videoId,
                            numberOfViews: response.data.items[0].statistics.viewCount
                        }
                    })
                }).catch(error => {
                    console.log(error)
                })
            }).catch(error => {
                console.log(error)
            })
        }
    })
    .catch(error => {
        console.error(error);
    });;
});

module.exports = router;