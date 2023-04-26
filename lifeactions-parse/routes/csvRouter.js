const csvRouter = require('express').Router();
const { config } = require('../dbConfig/dbConfigMySQL')
const stringify = require('csv-stringify-as-promised');
const path = require('path');
const fs = require('fs');

csvRouter.get('/getcsv/:tblName', async(req, res) => {
    try {
        const tblname = req.params.tblName
        let csvData = []
        
        var query = `SELECT * FROM ${tblname} order by created_at`
        let getDataProm = new Promise((resolve, reject) => {
            config.query(query, async function (err, result) {
                if (err) {
                    console.log('Get table data error: ', err.message)
                    reject(err)
                }
                if (result) {
                    resolve(result)
                }
            })
        })
        let result = await getDataProm
        
        if (!result) {
            console.log('error in getting table data')
            res.send('Error in getting table data')
            return
        }

        if (tblname == 'usage_stats') {
            columns = ['id', 'data_transaction_id', 'user_id', 'device_id', 'google_ad_id', 'telecom', 'phone_brand', 'model_name', 'apps_usage', 'event_time', 'created_at']
            result.forEach(r => {
                csvData.push([
                    r.id,
                    r.data_transaction_id,
                    r.user_id,
                    r.device_id,
                    r.google_ad_id,
                    r.telecom,
                    r.phone_brand,
                    r.model_name,
                    r.apps_usage,
                    r.event_time.toLocaleString(),
                    r.created_at.toLocaleString()
                ])
            })
        } else if (tblname == 'users') {
            columns = ['user_id', 'about', 'education', 'occupation', 'durables_used', 'created_at', 'mobile_no']
            result.forEach(r => {
                csvData.push([
                    r.user_id,
                    r.about,
                    r.education,
                    r.occupation,
                    r.durables_used,
                    r.created_at.toLocaleString(),
                    r.mobile_no
                ])
            })
        } else {
            columns = ['id', 'user_id', 'app_name', 'tag', 'data', 'event_time', 'created_at']
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
        }

        const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
        const dirName = path.join(__dirname, 'temp-files')
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        }
        const filePath = path.join(dirName, tblname + '.csv')
        fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
        res.download(filePath, () => {
            fs.unlink(filePath, (err) => {
                if (err) res.send(err.message);
            });
        });
        return
    } catch (error) {
        console.log('getCsv error: ', error.message)
        res.send(`Error: ${error.message}`)
    }
})


// csvRouter.get('/data', async(req, res) => {
//     let tblname = 'data_transaction_15_3_2023';
//     var query = `SELECT * FROM ${tblname} order by created_at`
//     let getDataProm = new Promise((resolve, reject) => {
//         config.query(query, async function (err, result) {
//             if (err) {
//                 console.log('Get table data error: ', err.message)
//                 reject(err)
//             }
//             if (result) {
//                 resolve(result)
//             }
//         })
//     })
//     let result = await getDataProm
//     let csvData = []
//     columns = ['id', 'data', 'user_id', 'file_id', 'created_at']
//     result.forEach(r => {
//         // csvData.push([
//         //     r.id,
//         //     r.data,
//         //     r.user_id,
//         //     r.file_id,
//         //     r.created_at.toLocaleString()
//         // ])
//         let dirName = path.join(__dirname, 'temp-files')
//         if (!fs.existsSync(dirName)) {
//             fs.mkdirSync(dirName);
//         }
//         let filePath = path.join(dirName, 'data' + r.file_id + '.txt')
//         fs.writeFileSync(filePath,'\ufeff' + r.data, { encoding: 'utf16le' }, { flag: 'w' });
//     })
//     // const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
//     // res.download(filePath, () => {
//     //     fs.unlink(filePath, (err) => {
//     //         if (err) res.send(err.message);
//     //     });
//     // });
//     res.send("Done")
//     return
// })

module.exports = {
    csvRouter
}