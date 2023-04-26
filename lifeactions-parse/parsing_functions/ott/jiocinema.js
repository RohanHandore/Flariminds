const { eventTimeFmt }= require('../helpers/event_time_fmt');
const { insertOTTData } = require('../helpers/db');

const jiocinemaParse = async(jiocinema_data) => {
    try {
        let parsedJiocinemaData = []

        // jiocinema parsing
        for (let k = 0; k < jiocinema_data.length; k++) {
            let y = jiocinema_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            // ad
            {
                let adData = new RegExp(/^Ad$/gm)
                // let adTime = new RegExp(/^\d\d:\d\d$/gm)
                if (y.data.includes('Ad')) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(adData)) {
                            let ad = ''
                            if (i > 1) {
                                ad += eventData[i-1]
                                if (i+1 < l) {
                                    if (eventData[i+1].includes('VideoAdCounter') && i+2 < l)
                                        ad += ' - ' + eventData[i+2]
                                    else
                                        ad += ' - ' + eventData[i+1]
                                }
                            }
                            if (ad != '')
                                parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'AD_NAME', ad, fmtEventTime])
                        }
                    }
                }
            }
            
            // movie watching
            {
                let movieScreenPattern = new RegExp(/Expandable Arrow.*Watchlist.*Share.*Download/gm)
                let showScreenPattern = new RegExp(/Expandable Arrow.*Watchlist.*Share.*Download.*Episodes/gm)
                let arrow = new RegExp(/^Expandable Arrow$/gm)
                let watchlist = new RegExp(/^Watchlist$/gm)
                if (y.data.match(showScreenPattern)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(arrow)) {
                            parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'SHOW_NAME', eventData[i-1], fmtEventTime])
                            i++
                            if (i < l) parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'EPISODE_NAME', eventData[i], fmtEventTime])
                            i++
                            if (i < l) parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'CONTENT_GENRE', eventData[i], fmtEventTime])
                            i++
                            if (i < l) parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'RELEASE_DATE', eventData[i], fmtEventTime])
                            i++
                            if (i < l) parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'CERTIFICATION', eventData[i], fmtEventTime])
                            i++
                            if (i < l && !eventData[i].match(watchlist)) parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'DESCRIPTION', eventData[i], fmtEventTime])
                        }
                    }
                } else if (y.data.match(movieScreenPattern)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(arrow)) {
                            parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'CONTENT_NAME', eventData[i-1], fmtEventTime])
                            let details = ''
                            i++
                            while (i < l && !eventData[i].match(watchlist)) {
                                if (eventData[i].length > 10) {
                                    parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'DESCRIPTION', eventData[i], fmtEventTime])
                                } else {
                                    if (details != '') details += ' - ' + eventData[i]
                                    else details += eventData[i]
                                    i++
                                }
                            }
                            if (details != '') {
                                parsedJiocinemaData.push([y.id, y.user_id, y.app_name, 'CONTENT_DETAILS', details, fmtEventTime])
                            }
                        }
                    }
                }
            }
        }

        if (parsedJiocinemaData.length > 0) {
            await insertOTTData(parsedJiocinemaData)
        }

    } catch (error) {
        console.log('JioCinema parsing error:', error.message)
        return
    }
}

module.exports = {
    jiocinemaParse
}