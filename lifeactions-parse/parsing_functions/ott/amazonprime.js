const { eventTimeFmt }= require('../helpers/event_time_fmt');
const { insertOTTData } = require('../helpers/db');

const amazonPrimeParse = async(amazonprime_data) => {
    try {
        let parsedAmazonPrimeData = []
    
        // amazonprime parsing
        for (let k = 0; k < amazonprime_data.length; k++) {
            let y = amazonprime_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            // content title clicked
            {
                let primeInclude = new RegExp(/Included with Prime/gm)
                let watch = new RegExp(/^Watch Now/gm)
                let watchAgain = new RegExp(/^Watch.*again$/gm)
                let continueWatchReg = new RegExp(/^Continue watching$/gm)
                let resumeWatchReg = new RegExp(/^Resume/gm)
                let more = new RegExp(/^More$/gm)
                // let download = new RegExp(/^Download$/gm)
                
                if (y.data.match(primeInclude)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(primeInclude) && i-1 >= 0) {
                            if (eventData[i-1].includes('Season')) {
                                parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_NAME', eventData[i-2], fmtEventTime])
                                parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_SEASON', eventData[i-1], fmtEventTime])
                                i++
                                if (eventData[i].match(resumeWatchReg)) {
                                    parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'EPISODE_TIME_LEFT', eventData[i+1], fmtEventTime])
                                }
                                while (i < l && !eventData[i].match(more)) {
                                    i++
                                }
                                i++
                                if (i < l) {
                                    parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_DESCRIPTION', eventData[i], fmtEventTime])
                                    i++
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_GENRE', eventData[i], fmtEventTime])
                                        i++
                                        if (i<l && eventData[i].includes('•')) {
                                            parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_GENRE', eventData[i], fmtEventTime])
                                            i++
                                        }
                                    }
                                    if (i < l) {
                                        if (eventData[i].includes('IMDb')) {
                                            parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_RATING', eventData[i], fmtEventTime])
                                            i = i + 2
                                        }
                                    }
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_SEASON_EPISODES', eventData[i], fmtEventTime])
                                        i++
                                    }
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_RELEASE_YEAR', eventData[i], fmtEventTime])
                                        i++
                                    }
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'SHOW_CERTIFICATION', eventData[i], fmtEventTime])
                                        i++
                                    }
                                    while (i<l && !eventData[i].includes('Cast & Crew')) {
                                        i++
                                    }
                                    let castNameReg = new RegExp(/. Button$/gm)
                                    let cast = []
                                    while (i<l && !eventData[i].includes('Director')) {
                                        if (eventData[i].match(castNameReg)) {
                                            cast.push(eventData[i+1])
                                        }
                                        i++
                                    }
                                    if (cast.length > 0) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'CAST', cast.join(', '), fmtEventTime])
                                    }
                                    if (i < l && eventData[i].includes('Director')) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'DIRECTOR', eventData[i-1], fmtEventTime])
                                    }
                                }
                            } else {
                                parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_NAME', eventData[i-1], fmtEventTime])
                                i++
                                if (eventData[i].match(watchAgain)) {
                                    i = i+4
                                } else if (eventData[i].match(watch)) {
                                    i = i+5
                                } else if (eventData[i].match(continueWatchReg)) {
                                    parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_TIME_LEFT', eventData[i+1], fmtEventTime])
                                    i = i+6
                                }
                                if (i < l) {
                                    parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_DESCRIPTION', eventData[i], fmtEventTime])
                                    i++
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_GENRE', eventData[i], fmtEventTime])
                                        i++
                                        if (i<l && eventData[i].includes('•')) {
                                            parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_GENRE', eventData[i], fmtEventTime])
                                            i++
                                        }
                                    }
                                    if (i < l) {
                                        if (eventData[i].includes('IMDb')) {
                                            parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_RATING', eventData[i], fmtEventTime])
                                            i = i + 2
                                        }
                                    }
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_RELEASE_YEAR', eventData[i], fmtEventTime])
                                        i++
                                    }
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_LENGTH', eventData[i], fmtEventTime])
                                        i++
                                    }
                                    if (i < l) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'MOVIE_CERTIFICATION', eventData[i], fmtEventTime])
                                        i++
                                    }
                                    while (i<l && !eventData[i].includes('Cast & Crew')) {
                                        i++
                                    }
                                    let castNameReg = new RegExp(/. Button$/gm)
                                    let cast = []
                                    while (i<l && !eventData[i].includes('Director')) {
                                        if (eventData[i].match(castNameReg)) {
                                            cast.push(eventData[i+1])
                                        }
                                        i++
                                    }
                                    if (cast.length > 0) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'CAST', cast.join(', '), fmtEventTime])
                                    }
                                    if (i < l && eventData[i].includes('Director')) {
                                        parsedAmazonPrimeData.push([y.id, y.user_id, y.app_name, 'DIRECTOR', eventData[i-1], fmtEventTime])
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    
        if (parsedAmazonPrimeData.length > 0) {
            await insertOTTData(parsedAmazonPrimeData)
        }
        return
    } catch (error) {
        console.log('Amazon prime parsing error:', error.message)
        return
    }
}

module.exports = {
    amazonPrimeParse
}