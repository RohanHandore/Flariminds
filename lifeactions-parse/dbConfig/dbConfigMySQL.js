require("dotenv").config()

var mysql = require('mysql');

// development endpoint
// var config = mysql.createPool({
//     host: "dev-lifeactions-db.ckzcfxihz4uf.ap-south-1.rds.amazonaws.com",
//     user: "admin",
//     password: "password123",
//     database: "lifeactions_rohan",
//     port: 3306
// })


// deploy endpoint
// var config = mysql.createPool({
//     host: "lifeactionstrack-01.ci4sut2yf8ox.ap-south-1.rds.amazonaws.com",
//     user: "admin",
//     password: "password123",
//     database: "lifeactions",
//     port: 3306
// })


// var config = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "rohan",
//     database: "lifeactions"
// });

module.exports = {
    config
}