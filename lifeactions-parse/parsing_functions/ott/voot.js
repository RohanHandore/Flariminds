const { eventTimeFmt } = require('../helpers/event_time_fmt');
const {insertOTTData }= require('../helpers/db');

const vootParse = async(voot_data) => {
    try {
        let parsedVootData = []
        //console.log('cart intro')

        // Voot Parsing
        for (let k = 0; k < voot_data.length; k++) {
            let y = voot_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false
            //console.log('cart intro3')

            var eventData
            // if (gotData) {
            //     continue
            // }
            
            // Movie Title clicked/Watching
            {
                let paused = new RegExp(/^PAUSED/gm)
                let watch=new RegExp(/^Watch Now/gm)
                let time = new RegExp(/\d+ hr \d+ min |\d+ min/gm)
                // For Clicked screen
                if(y.data.includes('Watch Now')
                   && y.data.includes('PAUSED')
                   && !y.data.includes('Go Ad-Free Now')) {
                    let show=false 
                    if(y.data.includes('Episodes')
                     || y.data.includes('All Episodes')){
                        show=true
                    }

                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    
                    for (let i = 0; i < l; i++) {
                        if (i>=0 && eventData[i].match(watch)){
                            s=i-1
                            while(s>=0){
                                if (eventData[s]=='PAUSED'){
                                    break;
                                }
                                else if (eventData[s].length>10){
                                    if (show){
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'CLICKED_SERIES_DESCRIPTION',eventData[s], fmtEventTime])
                                    }
                                    else{
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'CLICKED_MOVIE_DESCRIPTION',eventData[s], fmtEventTime])   
                                    }
                                    break;    
                                }
                                s-=1
                            }
                        }
                        else if(i<l && eventData[i].match(paused)){
                            if (show){
                                parsedVootData.push([y.id, y.user_id, y.app_name, 'CLICKED_SERIES_TITLE',eventData[i+1], fmtEventTime]) 

                            }
                            if (!show){
                                parsedVootData.push([y.id, y.user_id, y.app_name, 'CLICKED_MOVIE_TITLE',eventData[i+1], fmtEventTime]) 
                            }
                            let categories=[]
                            s=i+2
                            while (s<l && !eventData[s].includes('|')){
                                s+=1
                            }
                            if(s<l){
                                categories=eventData[s].split('|')
                                if (categories.length==4){
                                    if(show){
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'CLICKED_SERIES_LENGTH',categories[0], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'SERIES_LANGUAGE',categories[1], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'SERIES_GENRE',categories[2], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'SERIES_REALEASE_YEAR',categories[3], fmtEventTime]) 

                                    }
                                    else{
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'CLICKED_MOVIE_LENGTH',categories[0], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'MOVIE_LANGUAGE',categories[1], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'MOVIE_GENRE',categories[2], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'MOVIE_REALEASE_YEAR',categories[3], fmtEventTime]) 
    
                                    }
                                    
                                }
                                else if (categories.length==3){
                                    if(show){
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'SERIES_LANGUAGE',categories[0], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'SERIES_GENRE',categories[1], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'SERIES_RELEASE_YEAR',categories[2], fmtEventTime]) 
                                    }
                                    else{
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'MOVIE_LANGUAGE',categories[0], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'MOVIE_GENRE',categories[1], fmtEventTime]) 
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'MOVIE_RELEASE_YEAR',categories[2], fmtEventTime]) 
                                    }
                              
                                }
                                s+=1
                                if (eventData[s].includes('|')){
                                    if(show){
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'SERIES_CERTIFICATION',eventData[s], fmtEventTime]) 
                                    }
                                    else{
                                        parsedVootData.push([y.id, y.user_id, y.app_name, 'MOVIE_CERTIFICATION',eventData[s], fmtEventTime]) 

                                    }

                                }
                            }
                        }
                    }
                }
            }

            // shots
            {
                let views = new RegExp(/[0-9KM.]* Views/gm)
                let tag = new RegExp(/^#/gm)
                if (y.data.match(views)) {
                    eventData = y.data.split('^text:')
                    eventData = eventData.filter(e => e != '')
                    let l = eventData.length
                    
                    for (let i = 0; i < l; i++) {
                        if (eventData[i].match(views)) {
                            parsedVootData.push([y.id, y.user_id, y.app_name, 'SHOTS_VIDEO', eventData[i-1], fmtEventTime])
                            parsedVootData.push([y.id, y.user_id, y.app_name, 'SHOTS_VIEWS', eventData[i], fmtEventTime])
                            if (eventData[i-1].includes('#')) {
                                let desc = eventData[i].split(' ')
                                let tagsData = []
                                if (desc.length > 0) {
                                    desc.forEach(d => {
                                        if (d.match(tag)) {
                                            tagsData.push(d)
                                        }
                                    });
                                }
                                if (tagsData.length > 0) {
                                    parsedVootData.push([y.id, y.user_id, y.app_name, 'VIDEO_TAGS', tagsData.join(', '), fmtEventTime])
                                }
                            }
                        }
                    }
                }
            }

        }
        if (parsedVootData.length > 0) {
            await insertOTTData(parsedVootData)
        }
        return
    
        
    } catch(err) {
        console.log("Voot Parsing Error: ", err.message)
        return
    }
}
module.exports = {
     vootParse
}