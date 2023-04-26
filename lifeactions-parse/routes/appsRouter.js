const appsRouter = require('express').Router();

// const { sql, config } = require('../dbConfig')
const { config } = require('../dbConfig/dbConfigMySQL')

appsRouter.get('/list', async(req, res) => {
    var data = {error: false}
    try {
        var query = `select * from apps_m`;
        config.query(query, function(err, result) {
            if (err) {
                data['error'] = true
                data['message'] = err.message
                res.status(500).send(data)
            }
            if (result) {
                // console.log(result)
                let appsList = []
                // console.log(result)
                result.forEach(r => {
                    if (r.packageName && r.status == 'active') {
                        appsList.push(r.packageName)
                    }
                })
                data['error'] = false
                data['data'] = appsList
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
    appsRouter
}