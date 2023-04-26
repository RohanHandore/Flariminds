const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertOTTData} = require('../helpers/db');

const instaParse = async(insta_data) => {
    try {
        let parsedInstaData = []
    
        for (let k = 0; k < insta_data.length; k++) {
            let y = insta_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            
            var eventData
            
            // search text
            {
                let results = new RegExp(/See all results/gm)
                if (y.data.match(results)) {
                    eventData = y.data.split('^text:')
                    //console.log('first',eventData[1])
                    if (!eventData[1].includes('Results')){
                        parsedInstaData.push([y.id, y.user_id, y.app_name, 'SEARCH_TEXT', eventData[1], fmtEventTime])
                    }
                }
            }
            
            // video details
            {
                // let channel = new RegExp(/^@/gm)
                let audio = new RegExp(/Original audio/gm)
                let likes = new RegExp(/\d+ likes|^Liked by/gm)
                let liked=new RegExp(/^Liked$/gm)
                let comments = new RegExp(/\d+ comments/gm)
                let channel = new RegExp(/^@/gm)
                let tag = new RegExp(/^#/gm)
                let ago= new RegExp(/ago/gm)
                let view_comments= new RegExp(/^View all \d+ comments/gm)
                let month=new RegExp(/^January|^February|^March|^April|^May|^June|^July|^August|^September|^October|^November|^December/gm)
                if (y.data.match(audio)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(audio)){
                            let sound= eventData[i].split("• ")
                            parsedInstaData.push([y.id, y.user_id, y.app_name, 'VIDEO_SOUND', sound[0], fmtEventTime])
                        }
                        if (eventData[i].match(liked)){
                            parsedInstaData.push([y.id, y.user_id, y.app_name, 'VIDEO_LIKED', 'Yes', fmtEventTime])
                        }
                        if (i<l-1 && eventData[i].match(likes)) {
                            s=i
                            let tagsData = []
                            let tagsId = []
                            while (s<l){
                                if (eventData[s].match(ago)||eventData[s].match(month)){
                                    break;
                                }
                                if (eventData[s].match(likes)){
                                    parsedInstaData.push([y.id, y.user_id, y.app_name, 'VIDEO_LIKES', eventData[s], fmtEventTime])
                                    parsedInstaData.push([y.id, y.user_id, y.app_name, 'CREATOR_ID', eventData[s+1], fmtEventTime]) 
                                }
                                else if (eventData[s].match(comments)){
                                    parsedInstaData.push([y.id, y.user_id, y.app_name, 'VIDEO_COMMENTS', eventData[s], fmtEventTime])
                                }
                                else if (eventData[s].match(tag)){
                                    tagsData.push(eventData[s])
                                }
                                else if(eventData[s].match(channel)){
                                    tagsId.push(eventData[s])
                                }
                                
                                else if (eventData[s].length>25){
                                    parsedInstaData.push([y.id, y.user_id, y.app_name, 'VIDEO_DESCRIPTION', eventData[s], fmtEventTime])
    
                                }
                                
                                s+=1
                            }
                                if(tagsData.length>0){
                                    parsedInstaData.push([y.id, y.user_id, y.app_name, 'VIDEO_TAGS', tagsData.join(', '), fmtEventTime])
    
                                }
                                if (tagsId.length>0){
                                    parsedInstaData.push([y.id, y.user_id, y.app_name, 'VIDEO_TAGS_ID', tagsId.join(', '), fmtEventTime])
    
                                }           
                    }
                }
            }
            
            
            // sponsored post
            {
                let sponsor = new RegExp(/Sponsored/gm)
                let likes=new RegExp(/^\d+ likes/gm)
                let views= new RegExp(/^\d+ views/gm)
                if (y.data.match(sponsor)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    for (let i=0;i<l;i++){
                        if(i>=0 && eventData[i].match(sponsor)&&
                        !eventData[i-1].match(sponsor)){
                            parsedInstaData.push([y.id, y.user_id, y.app_name, 'SPONSORED_POST', eventData[i-1], fmtEventTime])
    
                        }
                        else if(eventData[i].match(likes)){
                            parsedInstaData.push([y.id, y.user_id, y.app_name, 'SPONSORED_POST_LIKES', eventData[i], fmtEventTime])
    
                        }
                        else if(eventData[i].match(views)){
                            parsedInstaData.push([y.id, y.user_id, y.app_name, 'SPONSORED_POST_VIEWS', eventData[i], fmtEventTime])
                        }
                    }
                    
                }
            }
            /*
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
                        parsedInstaData.push([y.id, y.user_id, y.app_name, 'SPONSORED_POST', eventData[1], fmtEventTime])
                    }
                }
            }
            */
    
        }
       
    
        }
    
        if (parsedInstaData.length > 0) {
            await insertOTTData(parsedInstaData)
        }
    } catch (error) {
        console.log('Insta parsing error: ', error.message)
        return
    }
}
module.exports = {
    instaParse
}