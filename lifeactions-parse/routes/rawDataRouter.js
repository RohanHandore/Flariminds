const rawDataRouter = require('express').Router();
// const { sql, config } = require('../dbConfig')
const { config } = require('../dbConfig/dbConfigMySQL')
const multer = require('multer');
const { TablesName } = require('../helpers/TablesName');

rawDataRouter.post('/writeFile', multer().single('file') ,async (req, res) => {
    var data = {error: false}
    try {
        // console.log("request is--------- : ", req);
        // console.log("request file is : ", req.file);
        // console.log("requst body is------ : ",req.body);
        // console.log("requst header userid------ : ",req.headers.userid);
    // const today = new Date()
    const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    var tdyDaySuffix = `${today.getDate()}_${today.getMonth()+1}_${today.getFullYear()}`
    let tableName = `${TablesName.FILE}_${tdyDaySuffix}`
        if (req.file) {          
            
            let sampleFile = req.file;
            let userId = req.headers.userid;
            if (!userId) {
                userId = 0
            }
            var query = `insert into ${tableName}(file_name, data, type, file_size_bytes, user_id) values ?`;
            let values = [
                [sampleFile.originalname, sampleFile.buffer, sampleFile.mimetype, sampleFile.size.toString(), userId]
            ]
            config.query(query, [values], function(err, result) {
                if (err) {
                    data['error'] = true
                    data['message'] = err.message
                    console.log(err.message)
                    res.status(500).send(data)
                }
                if (result && result.affectedRows > 0) {
                    data['error'] = false
                    data['message'] = "Data inserted"
                    res.status(200).send(data)
                }
            })
        } else {
            console.log("File not present");
            data['error'] = true
            data['message'] = "Request without File";
            res.status(400).send(data);
        }
    } catch (error) {
        console.log("req.body -- ", req.body)
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})

module.exports = {
    rawDataRouter
}