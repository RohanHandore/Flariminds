const { config } = require('../dbConfig/dbConfigMySQL')
const { TablesName } = require('./TablesName');
const stringify = require('csv-stringify-as-promised');
const path = require('path');
const fs = require('fs');

const createParsedDataCsv = async () => {
    try {
        let tblname = "audio_stream_data"
        let appname = "spotify"
        let filename = "spotify_data"
        let csvData = []
        columns = ['id', 'user_id', 'app_name', 'tag', 'data', 'event_time', 'created_at']

        var query = `SELECT * FROM ${tblname} where app_name like '%${appname}%'`
        // --where cast(event_time as date) = (select DATEADD(day, -1, CAST(GETDATE() AS date)))`;
        config.query(query, async function (err, result) {
            if (err) {
                console.log(err.message)
            }
            if (result) {
                result.forEach(r => {
                    csvData.push([
                        r.id,
                        r.user_id,
                        r.app_name,
                        r.tag,
                        r.data,
                        r.event_time.toLocaleString(),
                        r.created_at.toLocaleString()
                    ])
                })
                const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
                const dirName = path.join(__dirname, 'temp-files')
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName);
                }
                const filePath = path.join(dirName, `${filename}` + '.csv')
                fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
            }
        })
        return
    } catch (err) {
        console.log("csv create error: ", err.message)
        return
    }
}

const createFinalDataCsv = async () => {
    try {
        // const today = new Date()
        const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
        const prevDay = new Date(today.setDate(today.getDate() - 1))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth() + 1}_${prevDay.getFullYear()}`
        let fnlDataTblName = `${TablesName.EVENT_DATA}_${suffix}`
        let csvData = []
        columns = ['user_id', 'category_name', 'app_name', 'pattern_info', 'event_info', 'package_name', 'data_text', 'data_description', 'event_time', 'created_at']

        var query = `SELECT fd.id, fd.user_id, acm.category_name, apps_m.app_name, dpm.name as 'pattern_info'
            , fd.event_info, fd.package_name, data_text, data_description, fd.event_time, fd.created_at
            FROM ${fnlDataTblName} as fd
            left join apps_m on apps_m.app_id = fd.app_id
            left join event_info_m as dpm on dpm.id = fd.pattern_id
            left join app_category_m as acm on acm.id = fd.category_id`
        // --where cast(event_time as date) = (select DATEADD(day, -1, CAST(GETDATE() AS date)))`;
        config.query(query, async function (err, result) {
            if (err) {
                console.log(err.message)
            }
            if (result) {
                result.forEach(r => {
                    csvData.push([
                        r.user_id,
                        r.category_name,
                        r.app_name,
                        r.pattern_info,
                        r.event_info,
                        r.package_name,
                        r.data_text,
                        r.data_description,
                        r.event_time.toLocaleString(),
                        r.created_at.toLocaleString()
                    ])
                })
                const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
                const dirName = path.join(__dirname, 'temp-files')
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName);
                }
                const filePath = path.join(dirName, `data_file_${suffix}` + '.csv')
                fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
            }
        })
    } catch (err) {
        console.log("csv create error: ", err.message)
    }
}

const createRawDataCsv = async () => {
    try {
        let csvData = []
        columns = ['id', 'data_transaction_id', 'user_id', 'category_id', 'app_id', 'pattern_id', 'event_info', 'package_name', 'data_text', 'data_description', 'event_time', 'created_at']

        var query = `SELECT * FROM lifeactions.event_data_23_1_2023 where event_info like '%chrome%'`
        // --where cast(event_time as date) = (select DATEADD(day, -1, CAST(GETDATE() AS date)))`;
        config.query(query, async function (err, result) {
            if (err) {
                console.log(err.message)
            }
            if (result) {
                result.forEach(r => {
                    csvData.push([
                        r.id,
                        r.data_transaction_id,
                        r.user_id,
                        r.category_id,
                        r.app_id,
                        r.pattern_id,
                        r.event_info,
                        r.package_name,
                        r.data_text,
                        r.data_description,
                        r.event_time.toLocaleString(),
                        r.created_at.toLocaleString()
                    ])
                })
                const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
                const dirName = path.join(__dirname, 'temp-files')
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName);
                }
                const filePath = path.join(dirName, `chrome_data_sample` + '.csv')
                fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
            }
        })
    } catch (err) {
        console.log("csv create error: ", err.message)
    }
}

module.exports = {
    createParsedDataCsv,
    createFinalDataCsv,
    createRawDataCsv
}