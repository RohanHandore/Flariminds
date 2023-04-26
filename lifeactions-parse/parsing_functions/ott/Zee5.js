const { eventTimeFmt } = require('../helpers/event_time_fmt');
const { insertOTTData } = require('../helpers/db');



const zee5Parse = async (zee5_data) => {
    try {
        let parsedZee5Data = []

        for (let k = 0; k < zee5_data.length; k++) {
            let y = zee5_data[k]
            id = y.id
            let fmtEventTime = eventTimeFmt(y.event_time)
            let gotData = false

            let eventData = y.data.split('^text:')
            let i = 0


            const movie = new RegExp(/^Movie  •/);
            const zee5Content = new RegExp(/^ZEE5 Original  •/);
            const epsode = new RegExp(/^Episode  •/);
            const recentSearch = "Delete Search"

            for (let i = 0; i < eventData.length; i++) {
                // getting data of MOVIE
                {
                    if (eventData[i]?.match(movie) || eventData[i]?.match(zee5Content)) {
                        const arr = eventData[i].split("•").map(str => str.trim())
                        let movie_type = arr[1];
                        let uploadDate = arr[2];
                        let duration;
                        const date = new RegExp(/^\d{1,2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/);
                        if (movie_type.match(date)) {
                            movie_type = arr[3]
                            uploadDate = arr[1]
                            duration = arr[2]

                        }
                        parsedZee5Data.push([y.id, y.user_id, y.app_name, 'MOVIE_NAME', eventData[i - 1], fmtEventTime])
                        parsedZee5Data.push([y.id, y.user_id, y.app_name, 'MOVIE_DATE', uploadDate, fmtEventTime])
                        if (movie_type) {
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'GENRE', movie_type, fmtEventTime])
                        }
                        if (duration) {
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'MOVIE_DURATION', duration, fmtEventTime])
                        }

                    }
                }
                // getting data of WEB SERIES
                {
                    if (eventData[i]?.match(epsode)) {
                        // console.log(eventData[i]);
                        const arr = eventData[i].split("•").map(str => str.trim())

                        const Season = new RegExp(/Season\s\d+/);
                        let seriesName = arr[1]
                        let seriesEpsode = arr[2]
                        let seriesUploadDate = arr[3]
                        let seriesDuration = arr[4]
                        let seriesType = arr[5]
                        let seriesSeason;
                        if (seriesEpsode.match(Season)) {
                            seriesSeason = arr[2]
                            let seriesEpsode = arr[3]
                            let seriesUploadDate = arr[4]
                            let seriesDuration = arr[5]
                            let seriesType = arr[6]
                            // console.log(seriesUploadDate);
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_SEASON', seriesSeason, fmtEventTime])
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_NAME', seriesName, fmtEventTime])
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_UPLOAD_DATE', seriesUploadDate, fmtEventTime])
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_DURATION', seriesDuration, fmtEventTime])
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_TYPE', seriesType, fmtEventTime])
                        }
                        else {
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_NAME', seriesName, fmtEventTime])
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_UPLOAD_DATE', seriesUploadDate, fmtEventTime])
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_DURATION', seriesDuration, fmtEventTime])
                            parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SERIES_TYPE', seriesType, fmtEventTime])
                        }
                    }
                }
                // getting data of searched movie and seires
                {
                    if (eventData[i] === recentSearch) {
                        parsedZee5Data.push([y.id, y.user_id, y.app_name, 'SEARCHED_CONTENT', eventData[i - 2], fmtEventTime])
                    }
                }
            }
        }

        if (parsedZee5Data.length > 0) {
            await insertOTTData(parsedZee5Data)
        }
    } catch (error) {
        console.log('Zee5 parsing error: ', error.message);
        return
    }
}

module.exports = {
    zee5Parse
}