const { eventTimeFmt }= require('../helpers/event_time_fmt');
const { insertAudioStreamData }=require('../helpers/db');

const jiosaavnParse = async(jiosaavn_data) => {
    try {
        let parsedJiosaavnData = []
    
        // jiosaavn parsing
        for (let k = 0; k < jiosaavn_data.length; k++) {
            let y = jiosaavn_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            var eventData
    
            let adBanner = new RegExp(/[a-zA-Z0-9_]*_[0-9]\d*x[0-9]\d*/gm)
            let adBanner2 = new RegExp(/creativeGroupId=/gm)
    
            // click playlist
            {
                let dhmsf = new RegExp(/[0-9]\d*h [0-9]\d*m • [0-9]\d* Songs • [0-9]\d* Fans/gm)
                let dhms = new RegExp(/[0-9]\d*h [0-9]\d*m • [0-9]\d* Songs/gm)
                let dhmf = new RegExp(/[0-9]\d*h [0-9]\d*m • [0-9]\d* Fans/gm)
                let dhm = new RegExp(/[0-9]\d*h [0-9]\d*m/gm)
                let dmsf = new RegExp(/[0-9]\d*m • [0-9]\d* Songs • [0-9]\d* Fans/gm)
                let dms = new RegExp(/[0-9]\d*m • [0-9]\d* Songs/gm)
                let dmf = new RegExp(/[0-9]\d*m • [0-9]\d* Fans/gm)
                let dm = new RegExp(/[0-9]\d*m/gm)
                let dsf = new RegExp(/[0-9]\d* Songs • [0-9]\d* Fans/gm)
                let ds = new RegExp(/[0-9]\d* Songs/gm)
                let df = new RegExp(/[0-9]\d* Fans/gm)
    
                if (y.data.match(dhmsf) || y.data.match(dhms) || y.data.match(dhmf) || y.data.match(dhm)
                    || y.data.match(dmsf) || y.data.match(dms) || y.data.match(dmf) || y.data.match(dm)
                    || y.data.match(dsf) || y.data.match(ds) || y.data.match(df)) {
                        eventData = y.data.split('^text:')
                        eventData = eventData.filter(e => e != '')
                        let l = eventData.length
    
                        let exploreItem = false
    
                        parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_NAME', eventData[0], fmtEventTime])
    
                        parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_DESCRIPTION', eventData[1], fmtEventTime])
    
                        for (let i = 2; i < l; i++) {
                            if (eventData[i].includes('JiotuneIcon')) {
                                if (eventData[i - 2] == 'E') {
                                    parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_SONG_NAME', eventData[i-3], fmtEventTime])
                                } else {
                                    parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_SONG_NAME', eventData[i-2], fmtEventTime])
                                }
                                parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_SONG_DESCRIPTION', eventData[i-1], fmtEventTime])
                            }
                            if (eventData[i].match(adBanner)) {
                                parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'AD_BANNER', eventData[i], fmtEventTime])
                            }
                            if (eventData[i].match(adBanner2)) {
                                i++
                                if (i < l) {
                                    parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'AD_NAME', eventData[i], fmtEventTime])
                                }
                            }
                        }
                    }
            }
    
            // song playing screen
            {
                let lyrics = new RegExp(/Full Lyrics/gm)
                if (y.data.match(lyrics)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
    
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(lyrics)) {
                            i++
                            if (i < l) {
                                parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'PLAYING_SONG_NAME', eventData[i], fmtEventTime])
                            }
                            i++
                            if (i < l) {
                                parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'PLAYING_SONG_DESCRIPTION', eventData[i], fmtEventTime])
                            }
                        }
                        if (i < l && eventData[i].match(adBanner)) {
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'AD_BANNER', eventData[i], fmtEventTime])
                        }
                        if (i < l && eventData[i].match(adBanner2)) {
                            i++
                            if (i < l) {
                                parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'AD_NAME', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }
    
            // miniplayer song
            {
                let time = new RegExp(/^[0-9:]*$/gm)
                let playSong = new RegExp(/Play Current Song/gm)
                let jiotune = new RegExp(/^JIOTUNE$/gm)
                let switchVideo = new RegExp(/^Switch to Video$/gm)
                if (y.data.match(time)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
    
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(time) && l - i > 4) {
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'MINIPLAYER_SONG_CURRENT_TIME', eventData[i], fmtEventTime])
                            i++
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'MINIPLAYER_SONG_LENGTH', eventData[i], fmtEventTime])
                            i++
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'MINIPLAYER_SONG_NAME', eventData[i], fmtEventTime])
                            i++
                            if (eventData[i].match(jiotune)) i++
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'MINIPLAYER_SONG_DESCRIPTION', eventData[i - 1], fmtEventTime])
                        }
                        if (eventData[i].match(adBanner)) {
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'AD_BANNER', eventData[i], fmtEventTime])
                        }
                        if (eventData[i].match(adBanner2)) {
                            i++
                            if (i < l) {
                                parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'AD_NAME', eventData[i], fmtEventTime])
                            }
                        }
                    }
                }
            }
    
            // song/album details screen
            {
                let plays = new RegExp(/[0-9,]* Plays/gm)
                let album = new RegExp(/Album/gm)
                if (y.data.match(plays)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    if (l > 1) {
                        if (eventData[1].match(album)) {
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'ALBUM_NAME', eventData[0], fmtEventTime])
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'ALBUM_DETAILS', eventData[1], fmtEventTime])    
                        } else {
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'SONG_NAME', eventData[0], fmtEventTime])
                            parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'SONG_DETAILS', eventData[1], fmtEventTime])
                        }
                        for (let i = 2; i < l; i++) {
                            if (eventData[i].match(plays)) {
                                parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'NUMBER_OF_PLAYS', eventData[i], fmtEventTime])
                                break
                            }
                        }
                    }
                }
            }
    
            // search text
            {
                let clear = new RegExp(/Clear query/gm)
                if (y.data.match(clear)) {
                    eventData = y.data.split('^text:')
                    parsedJiosaavnData.push([y.id, y.user_id, y.app_name, 'SEARCH_TEXT', eventData[0], fmtEventTime])
                }
            }
    
        }
        
        if (parsedJiosaavnData.length > 0) {
            await insertAudioStreamData(parsedJiosaavnData)
        }
    } catch (error) {
        console.log('Jiosaavn parsing error: ', error.message)
        return
    }
}

module.exports = {
    jiosaavnParse
}