
const { ADDRGETNETWORKPARAMS } = require("dns");
const fs = require("fs");
const { resourceUsage } = require("process");
const { config } = require('./dbConfigMySQL')

//To Initialize the users,apps,events,tables
const Initialize = async() =>{
    try {
        var data = {error: false}
        // Read the SQL file
        const queriesSql = fs.readFileSync("./queries.sql").toString();
        // Convert the SQL string to array so that you can run them one at a time.
        const queriesArr = queriesSql.toString().split(";");

        queriesArr.forEach(async(query) => {
            if (query) {
                // Add the delimiter back to each query before you run them
                query += ";";
                let promiseQuery=new Promise(function(resolve,reject){
                    config.query(query, function(err) {
                        if (err) {
                            data['error'] = true
                            data['errorMessage'] = err.message
                            console.log(err.message)
                            reject(err)    
                        } else {
                            data['message'] = 'Table created'
                            resolve(data)
                        }
                    })
                }) 
                await promiseQuery            
            }
            });      
        return data
        } catch(error) {
            console.log("error.message -- ", error.message)
            data['error'] = true
            data['message'] = "Internal Error"
            return data
    }
}

//To Initialize the seed values in tables
const InitializeSeed = () =>{
    console.log('Seed values initialised');
    try {
        var data = {error: false}
        // Read the SQL file
        const queriesSql = fs.readFileSync("./seed.sql").toString();
        // Convert the SQL string to array so that you can run them one at a time.
        const queriesArr = queriesSql.toString().split(";");

        queriesArr.forEach(async(query) => {
            if (query) {
                // Add the delimiter back to each query before you run them
                query += ";";
                let promiseQuery=new Promise(function(resolve,reject){
                    config.query(query, function(err) {
                        if (err) {
                            data['error'] = true
                            data['errorMessage'] = err.message
                            console.log(err.message)
                            reject(err)    
                        } else {
                            data['message'] = 'Table created'
                            resolve(data)
                        }
                    })
                })
                await promiseQuery
                
            }
        });
        
        return data
        } catch(error) {
            console.log("error.message -- ", error.message)
            data['error'] = true
            data['message'] = "Internal Error"
            return data
    }  
}

//calling functions
// const callback = async ()=>{
//     await Initialize()
//     InitializeSeed()
// }
// callback()

// Initialize()
 //InitializeSeed()
