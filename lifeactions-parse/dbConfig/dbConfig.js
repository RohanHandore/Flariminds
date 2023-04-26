// require("msnodesqlv8");

// var production = false

// var sql = production ? require('mssql') : require('mssql/msnodesqlv8')

// var config = production ? {
//     server: 'lifeactions-db.ckzcfxihz4uf.ap-south-1.rds.amazonaws.com', 
//     database: 'lifeactions',
//     user: 'admin',
//     password: 'pass1234',
//     port: 1433,
//     options: {
//         trustServerCertificate: true,
//         Encrypt: true,
//     },
//     pool:{
//         max:10,
//         min:0,
//         idleTimeoutMillis:30000
//     },
//     requestTimeout: 300000
// } : {
//     server: 'localhost', 
//     database: 'lifeActions',
//     driver: 'msnodesqlv8',
//     user: '',
//     port: 1433,
//     options: {
//         trustedConnection: true,
//         trustServerCertificate: true,
//         Encrypt: true,
//     },
//     requestTimeout: 300000
// };

// module.exports = {
//     config,
//     sql
// }