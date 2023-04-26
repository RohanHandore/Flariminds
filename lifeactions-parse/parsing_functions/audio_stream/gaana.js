const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertAudioStreamData } = require('../helpers/db');

const gaanaParse = async (gaana_data) => {
    try {
        let parseGaanaData = [];

        // gaana data parsing    
        for (let k = 0; k < gaana_data.length; k++) {
            let y = gaana_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false

            var eventData


            let music = 'Playing Music';
            let recentSearch = 'Recent Searches';
            const podcast_played = new RegExp(/\d+min left/);

            eventData = y.data.split('^text:')
            eventData = eventData.filter(e => e != '')
            let l = eventData.length
            for (let i = 0; i < l; i++) {
                // getting data of receent music played
                {
                    if (eventData[i] === 'Recent Searches') {
                        for (let j = i + 1, len = eventData.length; j < len; j++) {
                            if (eventData[j] === 'Home' || eventData[j] === 'Search' || eventData[j] === 'Trending Searches' || eventData[j] === undefined) {
                                break;
                            }
                            if (eventData[j - 1] !== 'Home' && eventData[j - 1] !== 'Search' && eventData[j - 1] !== 'Trending Searches') {
                                parseGaanaData.push([y.id, y.user_id, y.app_name, 'NAME_OF_RECENT_MUSIC_PLAYED', eventData[j], fmtEventTime]);
                            }
                        }
                    }

                }

                // getting data of current music being played in full screen
                {
                    if (eventData[i] === "Playing Music" && eventData[i + 1] === "Song Name" && eventData[i + 2] === "Artist Name") {
                        music_title = eventData[i + 4];
                        music_artist = eventData[i + 5];
                        // console.log(music_artist, music_title);
                        parseGaanaData.push([y.id, y.user_id, y.app_name, 'NAME_OF_MUSIC', music_title, fmtEventTime])
                        parseGaanaData.push([y.id, y.user_id, y.app_name, 'NAME_OF_ARITST', music_artist, fmtEventTime])

                    }
                }

                // getting data of podcst being played
                {
                    if (eventData[i].match(podcast_played)) {

                        const [dateStr, durationStr] = eventData[i - 1].split(" - ");
                        // s = i - 1
                        // while (s>=0){
                        //     let regx2="ffgfg"
                        //     parseGaanaData.push([y.user_id, y.app_name, 'NAME_OF_PODCAST', eventData[s], fmtEventTime])

                        //     s-=1
                        // }
                        parseGaanaData.push([y.id, y.user_id, y.app_name, 'NAME_OF_PODCAST', eventData[i - 2], fmtEventTime])
                        parseGaanaData.push([y.id, y.user_id, y.app_name, 'PODCAST_UPLOAD_DATE', dateStr, fmtEventTime])
                        parseGaanaData.push([y.id, y.user_id, y.app_name, 'PODCAST_DURATION', durationStr, fmtEventTime])

                    }
                }


            }


        }
        if (parseGaanaData.length > 0) {
            // console.table(parseGaanaData);
            await insertAudioStreamData(parseGaanaData)
            // console.log('gotdata')
            // console.log(parseGaanaData)
        }

    } catch (error) {
        console.log("gaana parsing error:", error.message);
        return;
    }
}

module.exports = {
    gaanaParse
}
