const { eventTimeFmt }= require('../helpers/event_time_fmt');
const { insertOTTData } = require('../helpers/db');

const hotstarParse = async(hotstar_data) => {
    try {
        let parsedHotstarData = []

        // hotstar_parsing
        for (let k = 0; k < hotstar_data.length; k++) {
            let y = hotstar_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false

            var eventData

            // ad data
            // {
            //     let adData = new RegExp(/^Ad$/gm)
            //     let timeReg = new RegExp(/\d:\d/gm)
            //     let trailerTag = new RegExp(/Trailer/gm)
            //     if (y.data_text.match(adData)) {
            //         let off = -1
            //         y = hotstar_data[k + off]
            //         if (y && y.data_text != 'null' && !y.data_text.includes('Loading') && !y.data_text.match(timeReg) && !y.data_text.match(trailerTag)) {
            //             gotData = true
            //             parsedHotstarData.push([y.id, y.user_id, y.app_name, 'PLAYING_AD', y.data_text, fmtEventTime])
            //             off = 1
            //             y = hotstar_data[k + off]
            //             if (y && y.data_text != 'null') {
            //                 gotData = true
            //                 parsedHotstarData.push([y.id, y.user_id, y.app_name, 'PLAYING_AD', y.data_text, fmtEventTime])
            //             }
            //         }
            //         off = 0
            //         y = hotstar_data[k + off]
            //     }
            // }

            // homepage ad data
            {
                let adData1 = new RegExp(/^Ad/gm)
                let adData2 = new RegExp(/Advertiser/gm)
                if (y.data.match(adData2)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(adData2)) {
                            i++
                            if (i < l && eventData[i].match(adData1)) i++
                            if (i+1 < l) {
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'HOMEPAGE_AD_BANNER', eventData[i] + ' - ' + eventData[i+1], fmtEventTime])
                            }
                        }
                    }
                }
            }

            // video details for movie clicked
            {
                let watchlist = new RegExp(/Watchlist/gm)
                let watch = new RegExp(/^Watch$/gm)
                let cont = new RegExp(/^Continue$/gm)
                if (y.data.match(watchlist)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(watch) || eventData[i].match(cont)) {
                            i++
                            if (i < l && eventData[i].includes('Info')) {
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'CLICKED_MOVIE_TITLE', eventData[i-4], fmtEventTime])
                                let categories = eventData[i-3].split(' • ')
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_TIME', categories[0], fmtEventTime])
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_RELEASE_YEAR', categories[1], fmtEventTime])
                                if (categories.length == 5) {
                                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_LANGUAGE', categories[2], fmtEventTime])
                                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_GENRE', categories[3], fmtEventTime])
                                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_CERTIFICATION', categories[4], fmtEventTime])
                                } else {
                                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_GENRE', categories[2], fmtEventTime])
                                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_CERTIFICATION', categories[3], fmtEventTime])
                                }
                                i++
                            }
                            if (i < l) {
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_DESCRIPTION', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }

            // video details for movie and series playing
            {
                let watchlist = new RegExp(/your watchlist/gm)
                let watchlist2 = new RegExp(/^Watchlist$/gm)
                let starringTag = new RegExp(/^Starring/gm)
                let download = new RegExp(/^Download$/gm)
                if (y.data.match(watchlist)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length

                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(watchlist)) {
                            let j = 1
                            let k = i
                            
                            i++
                            if (i < l && eventData[i].match(watchlist2)) i++
                            if (i < l && eventData[i].includes('Share')) i++
                            if (i < l && !eventData[i].includes('Season')) {
                                if (i < l && !eventData[i].includes('Trailers')) {
                                    let extraVideos = []
                                    while (i < l && !eventData[i].includes('More Like This')) {
                                        if (!eventData[i].includes('sec') && !eventData[i].includes('min')) {
                                            extraVideos.push(eventData[i])
                                        }
                                        i++
                                    }
                                    if (extraVideos.length > 0) {
                                        parsedHotstarData.push([y.id, y.user_id, y.app_name, 'EXTRA_VIDEOS', extraVideos.join(', '), fmtEventTime])
                                    }
                                }
                                if (i < l && eventData[i].includes('More Like This')) {
                                    i++
                                    if (i < l && eventData[i].includes('MORE')) {
                                        i++
                                        let recommendations = []
                                        while (i < l && eventData[i].includes('Name')) {
                                            if (eventData[i].includes('Movie')) {
                                                recommendations.push(eventData[i].replace('Movie Name', ''))
                                            } else if (y.data_description.includes('Show')) {
                                                recommendations.push(eventData[i].replace('Show Name', ''))
                                            }
                                            i++
                                        }
                                        if (recommendations.length > 0) {
                                            parsedHotstarData.push([y.id, y.user_id, y.app_name, 'RECOMMENDATIONS', recommendations.join(', '), fmtEventTime])
                                        }
                                    }
                                }
                                if (eventData[k-1].match(download)) j = 2
                                if (eventData[k-j].match(starringTag)) j = 6
                                else j = 5
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'WATCHING_MOVIE', eventData[k-j], fmtEventTime])
                                let categories = eventData[k-j+1].split(' • ')
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'CATEGORY_TAGS', categories.join(', '), fmtEventTime])
                                let yearAndCert = eventData[k-j+2].split(' • ')
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_RELEASE_YEAR', yearAndCert[0], fmtEventTime])
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_CERTIFICATION', yearAndCert[1], fmtEventTime])
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_DESCRIPTION', eventData[k-j+3], fmtEventTime])
                                if (eventData[k-j+4].match(starringTag)) {
                                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'MOVIE_CAST', eventData[k-j+4], fmtEventTime])
                                }
                            } else {
                                if (eventData[k-1].match(download)) j = 2
                                if (eventData[k-j].match(starringTag)) j = 6
                                else j = 5
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'WATCHING_SERIES', eventData[k-j], fmtEventTime])
                                let episodeAndDate = eventData[k-j+1].split(' • ')
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'WATCHING_SEASON_EPISODE', episodeAndDate[0], fmtEventTime])
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'RELEASE_DATE', episodeAndDate[1], fmtEventTime])
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'EPISODE_NAME', eventData[k-j+2], fmtEventTime])
                                parsedHotstarData.push([y.id, y.user_id, y.app_name, 'EPISODE_DESCRIPTION', eventData[k-j+3], fmtEventTime])
                                if (eventData[k-j+4].match(starringTag)) {
                                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'CAST', eventData[k-j+4], fmtEventTime])
                                }
                            }
                        }
                    }
                }
            }

            // video details for sports video playing
            // {
            //     // let adData = new RegExp(/^Ad$/gm)
            //     // let timeReg = new RegExp(/\d:\d/gm)
            //     // let trailerTag = new RegExp(/Trailer/gm)
            //     let output = ''
            //     if (y.data_text == 'Download') {
            //         let off = -4
            //         y = hotstar_data[k + off]
            //         if (y && y.data_text == 'null' && !y.data_text.includes('Loading')) {
            //             off = 1
            //             y = hotstar_data[k + off]
            //             if (y && y.data_description.includes('watchlist')) {
            //                 off += 1
            //                 y = hotstar_data[k + off]
            //                 if (y && y.data_text.includes('Watchlist')) {
            //                     off += 1
            //                     y = hotstar_data[k + off]
            //                     if (y && y.data_text.includes('Share')) {
            //                         off += 1
            //                         y = hotstar_data[k + off]
            //                     }
            //                     off = -3
            //                     y = hotstar_data[k + off]
            //                     if (y && y.data_text != 'null') {
            //                         // console.log('Watching sports: ', y.data_text)
            //                         gotData = true
            //                         parsedHotstarData.push([
            //                             y.user_id,
            //                             y.app_name,
            //                             'WATCHING_SPORTS_VIDEO',
            //                             y.data_text,
            //                             fmtEventTime
            //                         ])
            //                     }
            //                     off += 1
            //                     y = hotstar_data[k + off]
            //                     if (y && y.data_text != 'null') {
            //                         parsedHotstarData.push([
            //                             y.user_id,
            //                             y.app_name,
            //                             'VIDEO_CATEGORY',
            //                             y.data_text,
            //                             fmtEventTime
            //                         ])
            //                     }
            //                     off += 1
            //                     y = hotstar_data[k + off]
            //                     if (y && y.data_text != 'null') {
            //                         parsedHotstarData.push([
            //                             y.user_id,
            //                             y.app_name,
            //                             'VIDEO_DESCRIPTION',
            //                             y.data_text,
            //                             fmtEventTime
            //                         ])
            //                     }
            //                 }
            //             }
            //         }
            //         off = 0
            //         y = hotstar_data[k + off]
            //     }
            // }

            // video details for video playing in 'Watch More' section, also includes sports videos
            {
                let watchMore = new RegExp(/Watch More/gm)
                let time = new RegExp(/(sec|min)$/gm)
                if (y.data.match(watchMore)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'VIDEO_CATEGORY', eventData[0], fmtEventTime])
                    parsedHotstarData.push([y.id, y.user_id, y.app_name, 'VIDEO_DETAILS', eventData[1], fmtEventTime])
                    if (eventData[2].match(time)) {
                        parsedHotstarData.push([y.id, y.user_id, y.app_name, 'VIDEO_TIME', eventData[2], fmtEventTime])
                        parsedHotstarData.push([y.id, y.user_id, y.app_name, 'VIDEO_NAME', eventData[3], fmtEventTime])
                    } else {
                        parsedHotstarData.push([y.id, y.user_id, y.app_name, 'VIDEO_NAME', eventData[2], fmtEventTime])
                    }
                }
            }
        }

        if (parsedHotstarData.length > 0) {
            await insertOTTData(parsedHotstarData)
        }
        return
    } catch (error) {
        console.log('Hotstar parsing error:', error.message)
        return
    }
}

module.exports = {
    hotstarParse
}