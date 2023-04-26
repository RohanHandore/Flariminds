const { config } = require('../../dbConfig/dbConfigMySQL');

const insertEcommerceData = async (parsedData) => {
    try {
        //console.log("picking data");
        if (parsedData.length > 0) {
            let insertDataPromise = new Promise(function (resolve, reject) {
                var query = `insert into ecommerce_data(data_event_id, user_id, app_name, tag, data, event_time) values ?`;
                config.query(query, [parsedData], function (err, result) {
                    if (err) {
                        console.log("Ecommerce data inserting error: ", err.message)
                        reject(err)
                    }
                    if (result) {
                        console.log('Ecommerce Data inserted successfully')
                        resolve(result)
                    }
                })
            })
            await insertDataPromise
        }
    } catch (err) {
        console.log("Ecommerce data inserting error: ", err.message)
        return
    }
}

const insertOTTData = async (parsedData) => {
    try {
        if (parsedData.length > 0) {
            let insertDataPromise = new Promise(function (resolve, reject) {
                var query = `insert into ott_data(data_event_id, user_id, app_name, tag, data, event_time) values ?`;
                config.query(query, [parsedData], function (err, result) {
                    if (err) {
                        console.log("OTT data table inserting error: ", err.message)
                        reject(err)
                    }
                    if (result) {
                        console.log('OTT Data inserted successfully')
                        resolve(result)
                    }
                })
            })
            await insertDataPromise
        }
    } catch (err) {
        console.log("OTT data inserting error: ", err.message)
        return
    }
}

const insertAudioStreamData = async (parsedData) => {
    try {
        if (parsedData.length > 0) {
            let insertDataPromise = new Promise(function (resolve, reject) {
                var query = `insert into audio_stream_data(data_event_id, user_id, app_name, tag, data, event_time) values ?`;
                config.query(query, [parsedData], function (err, result) {
                    if (err) {
                        console.log("Audio Stream data table inserting error: ", err.message)
                        reject(err)
                    }
                    if (result) {
                        console.log('Audio Stream Data inserted successfully')
                        resolve(result)
                    }
                })
            })
            await insertDataPromise
        }
    } catch (err) {
        console.log("Audio Stream data inserting error: ", err.message)
        return
    }
}

const insertShortVideoData = async (parsedData) => {
    try {
        if (parsedData.length > 0) {
            let insertDataPromise = new Promise(function (resolve, reject) {
                var query = `insert into short_video_data(data_event_id, user_id, app_name, tag, data, event_time) values ?`;
                config.query(query, [parsedData], function (err, result) {
                    if (err) {
                        console.log("Short video data table inserting error: ", err.message)
                        reject(err)
                    }
                    if (result) {
                        console.log('Short Video Data inserted successfully')
                        resolve(result)
                    }
                })
            })
            await insertDataPromise
        }
    } catch (err) {
        console.log("Short Video data inserting error: ", err.message)
        return
    }
}


module.exports = {
    insertEcommerceData,
    insertOTTData,
    insertAudioStreamData,
    insertShortVideoData
}