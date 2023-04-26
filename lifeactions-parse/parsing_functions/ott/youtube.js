const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertOTTData } = require('../helpers/db');

const youtubeParse = async (youtube_data) => {
    try {
        let parsedYoutubeData = []

        // youtube_parsing
        for (let k = 0; k < youtube_data.length; k++) {
            let y = youtube_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false

            var eventData
            // ad data
            {
                let adData = new RegExp(/Ad \· \d:\d\d/gm)
                let visitAd = new RegExp(/Visit advertiser/gm)
                // let output = ''
                if (y.data.match(adData)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(adData)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, "AD_INFO", eventData[i], fmtEventTime]);
                        }
                        if (i + 2 < l && eventData[i].match(visitAd)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'AD_NAME', eventData[i + 2], fmtEventTime])
                        }
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }

            // ad data
            {
                let adData2 = new RegExp(/Ad \· \d of \d · \d:\d\d/gm)
                let visitAd = new RegExp(/Visit advertiser/gm)
                if (y.data.match(adData2)) {
                    // if time doesn't reach 0:00 it means ad was skipped
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(adData2)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'AD_INFO', eventData[i], fmtEventTime])
                        }
                        if (i + 2 < l && eventData[i].match(visitAd)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'AD_NAME', eventData[i + 2], fmtEventTime])
                        }
                    }
                }
            }

            // if (gotData) {
            //     continue
            // }

            // video title details
            {
                let videoViews = new RegExp(/[\dKMB.]* views/gm)
                let videoLikes = new RegExp(/likes$/gm)
                let channelName = new RegExp(/^Subscribe to/gm)
                if (y.data.match(videoViews)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(videoViews) && i > 1) {
                            if (!eventData[i - 1].match(videoLikes)) {
                                parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'PLAYING_VIDEO_TITLE', eventData[i - 1], fmtEventTime])
                                parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'PLAYING_VIDEO_VIEWS', eventData[i], fmtEventTime])
                            }
                        }
                        if (eventData[i].includes('Subscribe to ')) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'PLAYING_VIDEO_CHANNEL',
                            eventData[i].replace('Subscribe to ', '').replace('.', ''), fmtEventTime])
                        }
                    }
                }
            }

            // video title details from miniplayer
            {
                let miniplayer = new RegExp(/Close miniplayer/gm)
                let miniVideo = new RegExp(/video$/gm)
                if (y.data.match(miniplayer)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(miniplayer)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'MINIPLAYER_VIDEO_TITLE', eventData[i - 3], fmtEventTime])
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'MINIPLAYER_VIDEO_CHANNEL', eventData[i - 2], fmtEventTime])
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_PLAYED_TIME', eventData[0], fmtEventTime])
                        }
                    }
                }
            }

            // video title details from drag handle
            {
                let videoDesc = new RegExp(/^Drag handle$/gm)
                let tagStart = new RegExp(/^#/gm)
                if (y.data.match(videoDesc)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        let videoTags = []
                        if (i + 5 < l && eventData[i].match(videoDesc)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_LIKES', eventData[i + 2], fmtEventTime])
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_VIEWS', eventData[i + 3], fmtEventTime])
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_UPLOAD_DATE', eventData[i + 4], fmtEventTime])
                            i = i + 4
                            let containsHash = true
                            while (containsHash) {
                                if (i < l && eventData[i].match(tagStart)) {
                                    videoTags.push(eventData[i])
                                    i++
                                } else {
                                    containsHash = false
                                }
                            }
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_DESCRIPTION', eventData[i], fmtEventTime])
                            if (eventData[i].includes('#')) {
                                let str = eventData[i]
                                let tagsIndex = str.indexOf('#')
                                while (tagsIndex != -1) {
                                    let nextSpaceIndex = str.indexOf(' ', tagsIndex + 1)
                                    let nextLineIndex = str.indexOf('\n', tagsIndex + 1)
                                    if (nextSpaceIndex == -1 && nextLineIndex == -1) {
                                        videoTags.push(str.substring(tagsIndex))
                                    } else {
                                        if (nextLineIndex == -1) {
                                            videoTags.push(str.substring(tagsIndex, nextSpaceIndex))
                                        } else if (nextSpaceIndex == -1) {
                                            videoTags.push(str.substring(tagsIndex, nextLineIndex))
                                        } else {
                                            if (nextSpaceIndex < nextLineIndex) {
                                                videoTags.push(str.substring(tagsIndex, nextSpaceIndex))
                                            } else {
                                                videoTags.push(str.substring(tagsIndex, nextLineIndex))
                                            }
                                        }
                                    }
                                    tagsIndex = str.indexOf('#', tagsIndex + 1)
                                }
                            }
                            if (videoTags.length > 0) {
                                parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_TAGS', videoTags.join(', '), fmtEventTime])
                            }
                        }
                    }
                }
            }

            // if the video is playing or paused
            {
                let prevVideo = new RegExp(/Previous video/gm)
                let nextVideo = new RegExp(/Next video/gm)
                let pause = new RegExp(/^Pause video$/gm)
                let play = new RegExp(/^Play video$/gm)
                if (y.data.match(prevVideo) && y.data.match(nextVideo)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(pause)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_PLAYING', null, fmtEventTime])
                        }
                        if (eventData[i].match(play)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'VIDEO_PAUSED', null, fmtEventTime])
                        }
                    }
                }
            }

            // get search data
            {
                let searchNav = new RegExp(/Navigate up/gm)
                let searchClear = new RegExp(/^Clear$/gm)
                let searchVoice = new RegExp(/^Voice search$/gm)
                let suggestion = new RegExp(/^Edit suggestion/gm)
                if (y.data.match(searchNav)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (i + 1 < l && eventData[i].match(searchClear) && eventData[i + 1].match(searchVoice)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'SEARCHED_TEXT', eventData[i - 1], fmtEventTime])
                        } else if (eventData[i].match(searchClear)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'SEARCH_TEXT', eventData[i - 1], fmtEventTime])
                        } else if (eventData[i].match(suggestion)) {
                            parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'SEARCH_SUGGESTION', eventData[i - 1], fmtEventTime])
                        }
                    }
                }
            }

            // shorts video details
            {
                let likeBtn = new RegExp(/Like button/gm)
                let dislikeBtn = new RegExp(/Dislike button/gm)
                if (y.data.match(likeBtn) && y.data.match(dislikeBtn)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(likeBtn)) {
                            if (i - 3 > 0) {
                                let videoTitle = eventData[i - 2]
                                parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'SHORTS_VIDEO_NAME', eventData[i - 2], fmtEventTime])
                                parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'SHORTS_VIDEO_CHANNEL', eventData[i - 3].replace('Subscribe to ', ''), fmtEventTime])
                                parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'SHORTS_VIDEO_LIKES', eventData[i - 1], fmtEventTime])
                                if (videoTitle.includes('#')) {
                                    let hash = new RegExp(/^#/gm)
                                    let t = videoTitle.split(' ')
                                    let videoTags = []
                                    if (t.length > 1) {
                                        for (let u = 0; u < t.length; u++) {
                                            if (t[u].match(hash)) {
                                                videoTags.push(t[u])
                                            }
                                        }
                                    }
                                    parsedYoutubeData.push([y.id, y.user_id, y.app_name, 'SHORTS_VIDEO_TAGS', videoTags.join(', '), fmtEventTime])
                                }
                            }
                        }
                    }
                }
            }
        }

        if (parsedYoutubeData.length > 0) {
            // await insertOTTData(parsedYoutubeData)
        }
    } catch (error) {
        console.log('Youtube parsing error: ', error.message)
        return
    }
}

module.exports = {
    youtubeParse
}