const devRouter = require('express').Router();
const { config } = require('../dbConfig/dbConfigMySQL');
const { convertFileToPlainText } = require('../helpers/dataTransaction');
const { parseData, parseUsageStatsData } = require('../helpers/parseData');
const { createParsedDataCsv } = require('../helpers/dataCsv');
const { checkAndCreateTables } = require('../helpers/createTables')
const { appLevelParse } = require('../parsing_functions/appLevelParsing');
const { TablesName } = require('../helpers/TablesName');
const { decryptStr, encrypt } = require('../helpers/encryptDecrypt');

devRouter.get('/cftpt', async (req, res) => {
    await convertFileToPlainText();
    res.send("Done")
})

devRouter.get('/pd', async (req, res) => {
    await parseData();
    res.send("Done")
})

devRouter.get('/run', async (req, res) => {
    // await createParsedDataCsv()
    let a = await appLevelParse()
    res.send("Done")
});

devRouter.get('/createCsv', async (req, res) => {
    // await createParsedDataCsv()
    res.send("Done")
});

devRouter.get('/createTables', async (req, res) => {
    await checkAndCreateTables(TablesName.FILE)
    await checkAndCreateTables(TablesName.DATA_TRANSACTION)
    await checkAndCreateTables(TablesName.EVENT_DATA)
    res.send("Done")
})

devRouter.get('/getTextArr/:id', async (req, res) => {
    try {
        const today = new Date()
        const prevDay = new Date(today.setDate(today.getDate()))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth() + 1}_${prevDay.getFullYear()}`
        let fnlDataTblName = `${TablesName.EVENT_DATA}_${suffix}`
        let id = req.params.id
        let getDataPromise = new Promise(function (resolve, reject) {
            var query = `select * from ${fnlDataTblName} where id = ${id}`;
            config.query(query, function (err, result) {
                if (err) {
                    console.log(err.message)
                    reject(err)
                }
                if (result) {
                    resolve(result)
                }
            })
        })
        let data = await getDataPromise
        if (data && data.length > 0) {
            let eventData = data[0].data.split('^text:')
            eventData = eventData.filter(e => e != "")
            res.send(eventData)
            return
        }
        res.send("No data found for this id")
        return
    } catch (err) {
        console.log(err.message)
        res.send(err.message)
    }
});

devRouter.get('/getTextArr', async (req, res) => {
    try {
        let getDataPromise = new Promise(function (resolve, reject) {
            const today = new Date()
            const prevDay = new Date(today.setDate(today.getDate() - 2))
            var suffix = `${prevDay.getDate()}_${prevDay.getMonth() + 1}_${prevDay.getFullYear()}`
            let fnlDataTblName = `${TablesName.EVENT_DATA}_${suffix}`
            let package_name = 'com.tv.v18.viola'
            var query = `select * from ${fnlDataTblName} where package_name like '%${package_name}%'`;
            config.query(query, function (err, result) {
                if (err) {
                    console.log(err.message)
                    reject(err)
                }
                if (result) {
                    resolve(result)
                }
            })
        })
        let data = await getDataPromise
        let d = []
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let eventData = data[i].data.split('^text:')
                eventData = eventData.filter(e => e != "")
                d.push({
                    id: data[i].id,
                    data: eventData
                })
            }
            res.send(d)
            return
        }
        res.send("No data found")
        return
    } catch (err) {
        console.log(err.message)
        res.send(err.message)
    }
});

devRouter.get('/decryptStr', async (req, res) => {
    // await decryptStr()
    // await parseUsageStatsData()
    res.send('Done')
})

devRouter.get('/encryptStr', async (req, res) => {
    // await encrypt()
    res.send('Done')
})

// // add data in raw data table
{
    // rawDataRouter.post('/add', async(req, res) => {
    //     var data = {error: false}
    //     try {
    //         const today = new Date()
    //         var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
    //         let tableName = `data_transaction_${tdyDaySuffix}`

    //         var query = `insert into ${tableName}(data, user_id) values ?`;
    //         let values = [
    //             [req.body.data, req.body.userid]
    //         ]
    //         config.query(query, [values], function(err, result) {
    //             if (err) {
    //                 data['error'] = true
    //                 data['message'] = err.message
    //                 res.status(500).send(data)
    //             }
    //             if (result && result.affectedRows > 0) {
    //                 data['error'] = false
    //                 data['message'] = "Data inserted"
    //                 res.status(200).send(data)
    //             }
    //         })
    //     } catch (error) {
    //         console.log("req.body -- ", req.body)
    //         console.log("error.message -- ", error.message)
    //         data['error'] = true
    //         data['message'] = "Internal Error"
    //         res.status(500).send(data)
    //     }
    // })
}


// // get data from raw data table
{
    // rawDataRouter.get('/getData', async(req, res) => {
    //     var data = {error: false}
    //     try {
    //         const today = new Date()
    //         var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
    //         let tableName = `data_transaction_${tdyDaySuffix}`

    //         var query = `select * from ${tableName}`;

    //         config.query(query, function(err, result) {
    //             if (err) {
    //                 data['error'] = true
    //                 data['message'] = err.message
    //                 res.status(500).send(data)
    //             }
    //             if (result) {
    //                 console.log(result)
    //                 data['error'] = false
    //                 data['data'] = result
    //                 res.status(200).send(data)
    //             }
    //         })
    //     } catch (error) {
    //         console.log("req.body -- ", req.body)
    //         console.log("error.message -- ", error.message)
    //         data['error'] = true
    //         data['message'] = "Internal Error"
    //         res.status(500).send(data)
    //     }
    // })
}


// // get raw data csv file
{
    // rawDataRouter.get('/getcsv/:date', async(req, res) => {
    //     try {
    //         var date = req.params.date
    //         var daySuffix
    //         if (!date) {
    //             const today = new Date()
    //             daySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
    //         } else {
    //             daySuffix = date
    //         }
    //         let tableName = `data_transaction_${daySuffix}`
    //         const dirName = path.join(__dirname, 'temp-files')
    //         const filePath = path.join(dirName, tableName + '.csv')
    //         res.download(filePath, () => {
    //             fs.unlink(filePath, (err) => {
    //                 if (err) res.send(err.message);
    //             });
    //         });
    //     } catch (err) {
    //         console.log(err)
    //         res.send(err.message)
    //     }
    // })
}


// // create raw data csv file
{
    // rawDataRouter.get('/createcsv/:date', async (req, res) => {
    //     var data = { error: false }
    //     try {
    //         var date = req.params.date
    //             var daySuffix
    //             if (!date) {
    //                 const today = new Date()
    //                 daySuffix = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`
    //             } else {
    //                 daySuffix = date
    //             }
    //         let tableName = `data_transaction_${daySuffix}`

    //         var query = `select * from ${tableName}`;

    //         config.query(query, async function(err, result) {
    //             if (err) {
    //                 data['error'] = true
    //                 data['message'] = err.message
    //                 res.status(500).send(data)
    //             }
    //             if (result) {
    //                 data['error'] = false
    //                 data['data'] = result
    //                 let csvData = []
    //                 columns = ['Id', 'Data', 'UserId', 'CreatedAt']
    //                 response.recordset.map(ap => {
    //                     csvData.push([ap.id, ap.data, ap.user_id, (new Date(ap.created_at)).toString()])
    //                 })
    //                 const raw = await stringify(csvData, { header: true, columns: columns, delimiter: '\t' });
    //                 const dirName = path.join(__dirname, 'temp-files')
    //                 if (!fs.existsSync(dirName)) {
    //                     fs.mkdirSync(dirName);
    //                 }
    //                 const filePath = path.join(dirName, tableName + '.csv')
    //                 fs.writeFileSync(filePath, '\ufeff' + raw, { encoding: 'utf16le' }, { flag: 'w' });
    //                 data['data'] = response.recordset
    //                 data['message'] = "Data sent successfully"
    //                 res.status(200).send(data)
    //             }
    //         })
    //     } catch (error) {
    //         console.log("req.body -- ", req.body)
    //         console.log("error.message -- ", error.message)
    //         data['error'] = true
    //         data['message'] = "Internal Error"
    //         res.status(500).send(data)
    //     }
    // })
}

// // read file table
{
    // rawDataRouter.get('/readFile', async (req, res) => {
    //     try {
    //         var data = {error: false}
    //         let fileData = {}
    //         const today = new Date()
    //         var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
    //         let tableName = `${TablesName.FILE}_${tdyDaySuffix}`

    //         var query = `select * from ${tableName}`;
    //         config.query(query, function(err, result) {
    //             if (err) {
    //                 data['error'] = true
    //                 data['message'] = err.message
    //                 res.status(500).send(data)
    //             }
    //             if (result) {
    //                 console.log(result)
    //                 data['error'] = false
    //                 data['data'] = result
    //                 res.status(200).send(data)
    //             }
    //         })
    //     } catch (error) {
    //         console.log("req.body -- ", req.body)
    //         console.log("error.message -- ", error.message)
    //         data['error'] = true
    //         data['message'] = "Internal Error"
    //         res.status(500).send(data)
    //     }
    // })
}

// // download csv file
{
    // parseDataRouter.get('/getCsv', async(req, res) => {
    //     try {
    //         // var date = req.params.date
    //         const today = new Date()
    //         const prevDay = new Date(today.setDate(today.getDate() - 1))
    //         var suffix = `${prevDay.getDate()}_${prevDay.getMonth()+1}_${prevDay.getFullYear()}`
    //         // else {
    //         //     daySuffix = date
    //         // }
    //         const dirName = path.join(__dirname, 'temp-files')
    //         const filePath = path.join(dirName, `data_file_${suffix}` + '.csv')
    //         res.download(filePath, () => {
    //             fs.unlink(filePath, (err) => {
    //                 if (err) res.send(err.message);
    //             });
    //         });
    //     } catch (err) {
    //         console.log(err)
    //         res.send(err.message)
    //     }
    // })
}

// parse from data patterns
const parseFromDataPattern = () => {
    // var checked = false
    // if (event_info.includes(y.event_info)) {
    //     for (let i = 0; i < data_patterns.length; i++) {
    //         let a = {
    //             user_id: y.user_id,
    //             event: data_patterns[i].name,
    //             // event_time: y.event_time?.toLocaleString(),
    //             app_name: y.app_name,
    //             category_name: y.category_name,
    //             data: ''
    //         }
    //         if (data_patterns[i].event_info == y.event_info) {
    //             if (data_patterns[i].prefix) {
    //                 if (y.data_text.includes(data_patterns[i].prefix)) {
    //                     if (data_patterns[i].suffix) {
    //                         if (y.data_text.includes(data_patterns[i].suffix)) {
    //                             if (data_patterns[i].data) {
    //                                 if (y.data_text.includes(data_patterns[i].data)) {
    //                                     a.data = y.data_text
    //                                     final_ott_data.push(a)
    //                                     checked = true
    //                                     // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                                 }
    //                             } else {
    //                                 a.data = y.data_text.substring(y.data_text.indexOf(data_patterns[i].prefix) + data_patterns[i].prefix.length, y.data_text.indexOf(data_patterns[i].suffix))
    //                                 final_ott_data.push(a)
    //                                 checked = true
    //                                 // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                             }
    //                         }
    //                     } else {
    //                         if (data_patterns[i].data) {
    //                             if (y.data_text.includes(data_patterns[i].data)) {
    //                                 a.data = y.data_text
    //                                 final_ott_data.push(a)
    //                                 checked = true
    //                                 // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                             }
    //                         } else {
    //                             a.data = y.data_text.substring(y.data_text.indexOf(data_patterns[i].prefix) + data_patterns[i].prefix.length)
    //                             final_ott_data.push(a)
    //                             checked = true
    //                             // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 if (data_patterns[i].suffix) {
    //                     if (y.data_text.includes(data_patterns[i].suffix)) {
    //                         if (data_patterns[i].data) {
    //                             if (y.data_text.includes(data_patterns[i].data)) {
    //                                 a.data = y.data_text
    //                                 final_ott_data.push(a)
    //                                 checked = true
    //                                 // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                             }
    //                         } else {
    //                             a.data = y.data_text.substring(0, y.data_text.indexOf(data_patterns[i].suffix))
    //                             final_ott_data.push(a)
    //                             checked = true
    //                             // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                         }
    //                     }
    //                 } else {
    //                     if (data_patterns[i].data) {
    //                         if (y.data_text.includes(data_patterns[i].data)) {
    //                             a.data = y.data_text
    //                             final_ott_data.push(a)
    //                             checked = true
    //                             // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                         }
    //                     } else {
    //                         a.data = y.data_text
    //                         if (!checked) {
    //                             final_ott_data.push(a)
    //                         }
    //                         // console.log(data_patterns[i].prefix, data_patterns[i].suffix, data_patterns[i].data, y.data_text)
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // } else if (y.data_text != '-') {
    //     let a = {
    //         user_id: y.user_id,
    //         event: '-',
    //         // event_time: y.event_time?.toLocaleString(),
    //         app_name: y.app_name,
    //         category_name: y.category_name,
    //         data: y.data_text
    //     }
    //     final_ott_data.push(a)
    // }
}

module.exports = {
    devRouter
}