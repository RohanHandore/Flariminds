const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertAudioStreamData } = require('../helpers/db');

const spotifyParse = async (Spotify_data) => {
    try {
        let parseSpotifyData = [];

        // spotify data parsing    
        for (let k = 0; k < Spotify_data.length; k++) {
            let y = Spotify_data[k]
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false

            var eventData

            let play = 'Play';
            let pause = 'Pause';
            let back = 'Back';
            let like_song = 'Like this song';
            let remove = 'Remove';
            const mins = new RegExp(/(\d+) MINS/);
            const likesMin = new RegExp(/(\d+,\d+)\slikes\s•\s\d+h\s\d+min$/);
            const timeRegex = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);



            if (y.data.includes(play) || y.data.includes(pause) || y.data.includes(back) || y.data.includes(remove)) {
                eventData = y.data.split('^text:')
                eventData = eventData.filter(e => e != '')
                let l = eventData.length
                for (let i = 2; i < l; i++) {
                    // getting data of playlist being played 
                    if (eventData[i].match(likesMin)) {

                        playlist_title = eventData[i - 2];

                        let [likesStr, duration] = eventData[i].split('•').map(str => str.trim()); // split by "•" and remove whitespace
                        let likes = parseInt(likesStr.replace(/[^0-9]/g, "")); // remove non-digits and convert to integer

                        // console.log(likes); // 202805
                        // console.log(duration); // "4h 32min"


                        parseSpotifyData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_LIKES', likes, fmtEventTime])
                        parseSpotifyData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_DURATION', duration, fmtEventTime])
                        parseSpotifyData.push([y.id, y.user_id, y.app_name, 'PLAYLIST_TITLE', playlist_title, fmtEventTime])
                    }
                    // getting data of which podcast is being played  on podcast screen
                    if (eventData[i].match(mins)) {
                        podcast_name = i - 2;
                        podcast_channel = i - 1;
                        parseSpotifyData.push([y.id, y.user_id, y.app_name, 'NAME_OF_PODCAST', eventData[podcast_name], fmtEventTime])
                        parseSpotifyData.push([y.id, y.user_id, y.app_name, 'NAME_OF_CHANNEL', eventData[podcast_channel], fmtEventTime])

                    }
                    // getting data of which song is being played 
                    if (eventData[i].match(like_song)) {
                        if (eventData[i - 1].includes('Connect to a device')) {
                            let k = i
                            if (eventData[i - 3].includes('Bluetooth')) {
                                k = i - 4
                            } else {
                                k = i - 2
                            }
                            if (eventData[k].includes(' • ')) {
                                parseSpotifyData.push([y.id, y.user_id, y.app_name, 'NAME_OF_SONG', eventData[k].split(' • ')[0], fmtEventTime])
                                parseSpotifyData.push([y.id, y.user_id, y.app_name, 'SONG_ARTIST', eventData[k].split(' • ')[1], fmtEventTime])
                            } else {
                                parseSpotifyData.push([y.id, y.user_id, y.app_name, 'NAME_OF_SONG', eventData[k - 1], fmtEventTime])
                                parseSpotifyData.push([y.id, y.user_id, y.app_name, 'SONG_ARTIST', eventData[k], fmtEventTime])
                            }
                        } else if (!(eventData[i - 3].match(timeRegex))) {
                            parseSpotifyData.push([y.id, y.user_id, y.app_name, 'NAME_OF_SONG', eventData[i - 3], fmtEventTime])
                            parseSpotifyData.push([y.id, y.user_id, y.app_name, 'SONG_ARTIST', eventData[i - 2], fmtEventTime])
                        } else {
                            parseSpotifyData.push([y.id, y.user_id, y.app_name, 'NAME_OF_SONG', eventData[i - 5], fmtEventTime])
                            parseSpotifyData.push([y.id, y.user_id, y.app_name, 'SONG_ARTIST', eventData[i - 4], fmtEventTime])
                        }
                    }
                    // getting data of which song is searched 
                    if (eventData[i].match(remove)) {
                        searched = i + 1;
                        if (eventData[searched] === "Clear recent searches") {
                            // Do nothing
                        } else {
                            parseSpotifyData.push([y.id, y.user_id, y.app_name, 'SEARCHED_SONG', eventData[searched], fmtEventTime]);
                        }
                    }

                }

            }

        }
        if (parseSpotifyData.length > 0) {
            await insertAudioStreamData(parseSpotifyData)
            // console.log('gotdata')
        }
    } catch (error) {
        console.log("spotify parse error:", error.message);
        return;
    }
}

module.exports = {
    spotifyParse
}
