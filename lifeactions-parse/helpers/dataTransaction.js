const { TablesName } = require("./TablesName")
const { config } = require("../dbConfig/dbConfigMySQL");
const { decryptStr } = require("./encryptDecrypt");

async function convertFileToPlainText() {
    try {
        let Files;
        // const today = new Date()
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        const yesterday = new Date(today.setDate(today.getDate()))
        var yesterdaySuffix = `${yesterday.getDate()}_${yesterday.getMonth() + 1}_${yesterday.getFullYear()}`

        let filesTableName = `${TablesName.FILE}_${yesterdaySuffix}`
        let dataTableName = `${TablesName.DATA_TRANSACTION}_${yesterdaySuffix}`

        var del_data_transaction
        let delDataTransactionsPromise = new Promise(function (resolve, reject) {
            var query = `delete from ${dataTableName}`;
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
        del_data_transaction = await delDataTransactionsPromise

        let fileToTxtPromise = new Promise(function (resolve, reject) {
            var query = `select * from ${filesTableName} order by id`
            config.query(query, async function (err, result) {
                if (err) {
                    console.log("Files not fetched");
                    reject(err)
                } else {
                    Files = result
                    // console.log("files fetched ", Files);
                    let values = []
                    if (Files.length > 0) {
                        for (let j = 0; j < Files.length; j++) {
                            let item = Files[j]
                            let strData = ''
                            // strData = await decryptStr((item.data).toString())
                            strData = (item.data).toString()
                            values.push([
                                strData, item.user_id, item.id
                            ])
                        }
                    }
                    if (values.length > 0) {
                        var q = `insert into ${dataTableName}(data, user_id, file_id) values ?`;
                        config.query(q, [values], function (err, result) {
                            if (err) {
                                console.log("Data string inserting error: ", err.message)
                            }
                            if (result && result.affectedRows > 0) {
                                console.log('Data inserted successfully')
                            }
                        })
                    }
                    resolve(values)
                }
            })
        })
        await fileToTxtPromise
    } catch (error) {
        console.log("Error in convertFileToPlanText", error.message);
        return { error: true, message: 'Error occured in convertFileToPlanText' };
    }

}

module.exports = {
    convertFileToPlainText
}