const userRouter = require('express').Router();

// const { sql, config } = require('../dbConfig')
const { config } = require('../dbConfig/dbConfigMySQL')

userRouter.post('/create', async(req, res) => {
    var data = {error: false}
    try {
        var query = `insert into users(about, education, occupation, durables_used, mobile_no) values ?`;
        let values = [
            [req.body.about, req.body.education, req.body.occupation, req.body.durables_used, req.body.Mobile_no]
        ]
        config.query(query, [values], function(err, result) {
            if (err) {
                data['error'] = true
                data['message'] = err.message
                console.log('user create error: ', err.message)
                res.status(500).send(data)
            }
            if (result && result.affectedRows > 0) {
                data['error'] = false
                data['message'] = "Data inserted"
                data['user_id'] = result.insertId
                res.status(200).send(data)
            }
        })
    } catch (error) {
        console.log("req.body -- ", req.body)
        console.log("error.message -- ", error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})

userRouter.get('/getusers', async(req, res) => {
    var data = {error: false}
    try {
        var query = `select * from users`;
        config.query(query, function(err, result) {
            if (err) {
                data['error'] = true
                data['message'] = err.message
                res.status(500).send(data)
            }
            if (result) {
                console.log(result)
                data['error'] = false
                data['data'] = result
                res.status(200).send(data)
            }
        })
    } catch (error) {
        console.log(error.message)
        data['error'] = true
        data['message'] = "Internal Error"
        res.status(500).send(data)
    }
})


module.exports = {
    userRouter
}