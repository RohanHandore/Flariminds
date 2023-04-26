const { eventTimeFmt }= require('../helpers/event_time_fmt');
const { insertShortVideoData }=require('../helpers/db');

const joshParse = async(moj_data) => {
    try {
        let parsedJoshData = []
    
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
                    parsedJoshData.push([y.id, y.user_id, y.app_name, 'SEARCH_TEXT', eventData[0], fmtEventTime])
                }
            }
    
            // video details
            {
                // let channel = new RegExp(/^@/gm)
                let tag = new RegExp(/^#/gm)
                let follow = new RegExp(/^Follow/gm)
                let comment = new RegExp(/^Comment here/gm)
                let num = new RegExp(/[0-9.KM]*/gm)
                let num2 = new RegExp(/^[0-9.KM]*$/gm)
                let sponsor = new RegExp(/^Sponsored$/gm)
                if (y.data.match(num)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(num2)) {
                            i++
                            if (i < l && eventData[i].match(num2) && !eventData[0].match(num2)) {
                                parsedJoshData.push([y.id, y.user_id, y.app_name, 'VIDEO_CREATOR_ID', eventData[0], fmtEventTime])
                                let k = 1
                                if (eventData[1].match(follow)) {
                                    k = 2
                                }
                                parsedJoshData.push([y.id, y.user_id, y.app_name, 'VIDEO_SONG', eventData[k], fmtEventTime])
                                parsedJoshData.push([y.id, y.user_id, y.app_name, 'VIDEO_DESCRIPTION', eventData[k+1], fmtEventTime])
                                let desc = eventData[k+1].split(' ')
                                let tagsData = []
                                if (desc.length > 0) {
                                    desc.forEach(d => {
                                        if (d.match(tag)) {
                                            tagsData.push(d)
                                        }
                                    });
                                }
                                parsedJoshData.push([y.id, y.user_id, y.app_name, 'VIDEO_TAGS', tagsData.join(', '), fmtEventTime])
                                parsedJoshData.push([y.id, y.user_id, y.app_name, 'VIDEO_LIKES', eventData[i-1], fmtEventTime])
                                parsedJoshData.push([y.id, y.user_id, y.app_name, 'VIDEO_COMMENTS', eventData[i], fmtEventTime])
                            }
                        }
                        if (i+1 < l && eventData[i].match(sponsor)) {
                            parsedJoshData.push([y.id, y.user_id, y.app_name, 'SPONSOR', eventData[i+1], fmtEventTime])
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
                        parsedJoshData.push([y.id, y.user_id, y.app_name, 'COMMENTING', eventData[l - 2], fmtEventTime])
                    }
                }
            }
    
            // sponsored post
            {
                let sponsor = new RegExp(/Sponsored/gm)
                if (y.data.match(sponsor)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    if (eventData[0].match(sponsor)) {
                        parsedJoshData.push([y.id, y.user_id, y.app_name, 'SPONSORED_POST', eventData[1], fmtEventTime])
                    }
                }
            }
    
            // live content
            {
                let room = new RegExp(/'s Room/gm)
                let room2 = new RegExp(/'s Room$/gm)
                let viewers = new RegExp(/viewers$/gm)
                if (y.data.match(room)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(num2)) {
                            i++
                        }
                    }
                    if (eventData[0].match(sponsor)) {
                        parsedJoshData.push([y.id, y.user_id, y.app_name, 'SPONSORED_POST', eventData[1], fmtEventTime])
                    }
                }
            }
    
        }
        if (parsedJoshData.length > 0) {
            await insertShortVideoData(parsedJoshData)
            // console.log('gotdata')
        }   
    } catch (error) {
        console.log("Josh app parsing error:", error.message);
        return
    }
}

module.exports = {
    joshParse
}