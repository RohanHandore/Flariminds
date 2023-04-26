// var sql = require("mssql");
const { TablesName } = require("./TablesName");
// const config = require('../dbConfig');
const TableQueries = require("../dbConfig/TableQueries");
const { config } = require('../dbConfig/dbConfigMySQL')

const checkAndCreateTables = async(type) => {
    try {
      var res = await checkAndCreateTdyDataTbl(type);
      if (res.error) {
        console.log("Error in creating today table")
      } else {
        console.log("Today table created")
      }
      res = await checkAndCreateNxtDayDataTbl(type);
      if (res.error) {
        // console.log(res.message)
        console.log("Error in creating next day table")
      } else {
        console.log("Next day table created")
      }
    } catch(err) {
      console.log(err.message)
    }
  }
  
const checkTable = async(tableName) => {
    try {
        var data = {error: false}
        var query = `SHOW TABLES LIKE '${tableName}'`
        let checkTblPromise = new Promise(function(resolve, reject) {
            config.query(query, function(err, result) {
                if (err) {
                    data['error'] = true
                    data['errorMessage'] = "Database connection error"
                    reject()
                } else {
                    if (result.length > 0) {
                        data['tableFound'] = true
                        resolve()
                    } else {
                        data['tableFound'] = false
                        resolve()
                    }
                }
            })
        })
        await checkTblPromise
        return data
    } catch(err) {
        data['error'] = true
        console.log(err.message)
        return data
    }
}

const createNewTable = async (tableName, type) => {
    console.log("In create new table : ", tableName, "  type is : ", type);
    var data = {error: false}
    try {
        var query;
        switch (type) {
            case TablesName.DATA_TRANSACTION:
                        query = TableQueries.data_transaction(tableName);               
                        break;
            case TablesName.FILE:
                        query = TableQueries.file(tableName);
                        break;
            case TablesName.EVENT_DATA:
                        query = TableQueries.event_data(tableName);
                        break;
            default: query = null;
                break;
        }
        if (query) {
            let createTblPromise = new Promise(function(resolve, reject) {
                config.query(query, function(err) {
                    if (err) {
                        data['error'] = true
                        data['errorMessage'] = err.message
                        resolve()
                    } else {
                        data['message'] = 'Table created'
                        resolve()
                    }
                })
            })
            await createTblPromise
        } else {
            console.log("Unable to set query for table creation");
        }
        return data
    } catch(error) {
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        return data
    }   
}

const checkAndCreateTdyDataTbl = async(type) => {
    var response = {error: false, tblCreated: false}
    try {
        // create data transaction table for today if not exist
        // const today = new Date()
        const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
        var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
        let tableName = `${type}_${tdyDaySuffix}`
        var isTbl = await checkTable(tableName)
        if (!isTbl.error) {
            if (!isTbl.tableFound) {
                let newTblRes = await createNewTable(tableName,type);
                if (newTblRes.error) {
                    response['error'] = true
                    response['message'] = newTblRes.errorMessage
                } else {
                    response.tblCreated = true
                }
            } else if (isTbl.tableFound) {
                console.log('Table with same name found of type ', type);
                response['error'] = true
                response['message'] = `Table with same name found of type ${type}`
            }
        } else {
            console.log("Error in checkAndCreateTdyDataTbl isTbl : ", isTbl.errorMessage)
            response.error = true
        }
        return response
      } catch(err) {
        console.log("Error in checkAndCreateTdyDataTbl : ", err.message)
        response.error = true
        return response
      }
}

const checkAndCreateNxtDayDataTbl = async(type) => {
    var response = {error: false, tblCreated: false}
    try {
        // create data transaction table for next day if not exist
        // const today = new Date()
        const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
        const nextDay = new Date(today.setDate(today.getDate() + 1))
        var nxtDaySuffix = `${nextDay.getDate()}_${nextDay.getMonth()+1}_${nextDay.getFullYear()}`
        let tableName = `${type}_${nxtDaySuffix}`
        isTbl = await checkTable(tableName)
        if (!isTbl.error) {
            if (!isTbl.tableFound) {
                let newTblRes = await createNewTable(tableName,type);
                if (newTblRes.error) {
                    response['error'] = true
                    response['message'] = newTblRes.errorMessage
                } else {
                    response.tblCreated = true
                }
            } else if (isTbl.tableFound) {
                console.log('Table with same name found of type ', type);
                response['error'] = true
                response['message'] = `Table with same name found of type ${type}`
            }
        } else {
            console.log("Error in checkAndCreateNxtDayDataTbl isTbl : ", isTbl.errorMessage)
            response.error = true
        }
        return response
    } catch(err) {
        console.log("Error in checkAndCreateNxtDayDataTbl : ", err.message)
        response.error = true
        return response
    }
}

module.exports = {
    checkAndCreateTdyDataTbl,
    checkAndCreateNxtDayDataTbl,
    createNewTable,
    checkTable,
    checkAndCreateTables
}