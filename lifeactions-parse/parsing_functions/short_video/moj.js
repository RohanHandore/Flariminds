const { eventTimeFmt }= require('../helpers/event_time_fmt');
const { insertShortVideoData }=require('../helpers/db');

const mojParse = async(moj_data) => {
    try {
        let parsedMojData = []
    
        for (let k = 0; k < moj_data.length; k++) {
            let y = moj_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            var eventData
    
            // search text
            {
                let clear = new RegExp(/Clear query/gm)
                if (y.data.match(clear)) {
                    eventData = y.data.split('^text:')
                    parsedMojData.push([y.id, y.user_id, y.app_name, 'SEARCH_TEXT', eventData[0], fmtEventTime])
                }
            }
    
            // video details
            {
                let channel = new RegExp(/^@/gm)
                let tag = new RegExp(/^#/gm)
                let follow = new RegExp(/^Follow/gm)
                let comment = new RegExp(/^Comment here/gm)
                let num = new RegExp(/^[0-9.KM]*$/gm)
                if (y.data.includes('@')) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(channel)) {
                            parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_CREATOR_ID', eventData[i], fmtEventTime])
                            parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_SONG', eventData[0], fmtEventTime])
                            i++
                            if (i < l && !eventData[i].match(follow) && !eventData[i].match(comment)) {
                                parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_DESCRIPTION', eventData[i], fmtEventTime])
                                let desc = eventData[i].split(' ')
                                let tagsData = []
                                let tagsId = []
                                if (desc.length > 0) {
                                    desc.forEach(d => {
                                        if (d.match(tag)) {
                                            tagsData.push(d)
                                        }
                                        if (d.match(channel)) {
                                            tagsId.push(d)
                                        }
                                    });
                                }
                                if (tagsData.length > 0) {
                                    parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_TAGS', tagsData.join(', '), fmtEventTime])
                                }
                                if (tagsId.length > 0) {
                                    parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_TAGS_ID', tagsId.join(', '), fmtEventTime])
                                }
                            }
                            for (let j = i; j < l; j++) {
                                if (eventData[j].match(num)) {
                                    parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_LIKES', eventData[j], fmtEventTime])
                                    j++
                                }
                                if (j < l && eventData[j].match(num)) {
                                    parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_COMMENTS', eventData[j], fmtEventTime])
                                    j++
                                }
                                if (j < l && eventData[j].match(num)) {
                                    parsedMojData.push([y.id, y.user_id, y.app_name, 'VIDEO_SHARES', eventData[j], fmtEventTime])
                                    j++
                                }
                            }
                        }
                    }
                }
            }
    
            // commenting
            {
                let post = new RegExp(/^Post/gm)
                if (y.data.includes('Post')) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    if (eventData[l - 1].match(post)) {
                        parsedMojData.push([y.id, y.user_id, y.app_name, 'COMMENTING', eventData[l - 2], fmtEventTime])
                    }
                }
            }

            // ad details
            {
                let sponsor = new RegExp(/Sponsored/gm)
                if (y.data.match(sponsor)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(sponsor)) {
                            parsedMojData.push([y.id, y.user_id, y.app_name, 'SPONSORED_AD', eventData[i - 1], fmtEventTime])
                            parsedMojData.push([y.id, y.user_id, y.app_name, 'SPONSORED_AD_DETAILS', eventData[i + 1], fmtEventTime])
                        }
                    }
                }
            }
    
        }
        if (parsedMojData.length > 0) {
            await insertShortVideoData(parsedMojData)
            // console.log('gotdata')
        }   
    } catch (err) {
        console.log("Moj app parsing error: ", err.message)
        return
    }
}

module.exports = {
    mojParse
}