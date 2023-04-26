const { TablesName } = require('../helpers/TablesName');
const { config } = require('../dbConfig/dbConfigMySQL');
const { youtubeParse } = require('./ott/youtube');
const { hotstarParse } = require('./ott/hotstar');
const { jiocinemaParse } = require('./ott/jiocinema');
const { amazonPrimeParse } = require('./ott/amazonprime');
const { amazonShoppingParse } = require('./ecommerce/amazonShopping');
const { flipkartParse } = require('./ecommerce/flipkart');
const { jiomartParse } = require('./ecommerce/jiomart');
const { myntraParse } = require('./ecommerce/myntra');
const { jiosaavnParse } = require('./audio_stream/jiosaavn');
const { spotifyParse } = require('./audio_stream/spotify');
const { gaanaParse } = require('./audio_stream/gaana');
const { mojParse } = require('./short_video/moj');
const { nykaaParse } = require('./ecommerce/nykaa');
const { vootParse } = require('./ott/voot');
const { joshParse } = require('./short_video/josh');
const { meeshoParse } = require('./ecommerce/meesho');
const { mxplayerParse } = require('./ott/mxplayer');
const { zee5Parse } = require('./ott/Zee5');
const { hoichoiParse } = require('./ott/hoichoi');
const { instaParse } = require('./short_video/insta');
const { sonyLivParse } = require('./ott/sonyLiv');

const appLevelParse = async () => {
    // var id = 1
    try {
        // const today = new Date()
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        const prevDay = new Date(today.setDate(today.getDate()))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth() + 1}_${prevDay.getFullYear()}`
        let fnlDataTblName = `${TablesName.EVENT_DATA}_${suffix}`

        var query = `SELECT fd.id, fd.user_id, acm.category_name, apps_m.app_name, dpm.name as 'pattern_info'
            , fd.event_info, fd.package_name, data, event_time, fd.created_at
            FROM ${fnlDataTblName} as fd
            left join apps_m on apps_m.app_id = fd.app_id
            left join event_info_m as dpm on dpm.id = fd.pattern_id
            left join app_category_m as acm on acm.id = fd.category_id`
        // --where cast(event_time as date) = (select DATEADD(day, -1, CAST(GETDATE() AS date)))`;
        var events_data = []
        let eventsDataPromise = new Promise(function (resolve, reject) {
            config.query(query, async function (err, result) {
                if (err) {
                    console.log("event_data table error: ", err.message)
                    reject(err)
                }
                if (result) {
                    resolve(result)
                }
            })
        })

        events_data = await eventsDataPromise

        // const categorizedData = Object.keys(appNames).reduce((acc, appName) => {
        //     acc[appNames[appName]] = events_data.filter(item => item.app_name === appNames[appName])
        //     return acc
        // }, {})

        var query = `SELECT app_name FROM apps_m`
        var apps = []
        let appsPromise = new Promise(function (resolve, reject) {
            config.query(query, async function (err, result) {
                if (err) {
                    console.log(err.message)
                    reject(err)
                }
                if (result) resolve(result)
            })
        })
        apps = await appsPromise
        // let appsList = apps.map(a => a.app_name).filter(a => a)
        let appsList = ["com.google.android.youtube"]
        let appsData = {}

        appsList.forEach(a => appsData[a] = [])

        events_data.forEach(e => {
            if (e.package_name) {
                if (appsData[e.package_name]) appsData[e.package_name].push(e)
            }
        });


        await youtubeParse(appsData['com.google.android.youtube'])
        // await hotstarParse(appsData['hotstar'])
        // await jiocinemaParse(appsData['jio_cinema'])
        // await amazonPrimeParse(appsData['amazon_prime'])
        // await amazonShoppingParse(appsData['amazon'])
        // await flipkartParse(appsData['flipkart'])
        // await myntraParse(appsData['myntra'])
        // await jiosaavnParse(appsData['jiosaavn'])
        // await jiomartParse(appsData['jiomart'])
        // await mojParse(appsData['moj'])
        // await meeshoParse(appsData['com.meesho.supply'])
        // await nykaaParse(appsData['nykaa'])
        // await vootParse(appsData['voot'])
        // await joshParse(appsData['josh'])
        // await spotifyParse(appsData['com.spotify.music']);
        // await gaanaParse(appsData['gaana']);
        // await hoichoiParse(appsData['hoichoi']);
        // await mxplayerParse(appsData['mxplayer']);
        // await zee5Parse(appsData['zee5']);
        // await instaParse(appsData['insta']);
        // await sonyLivParse(appsData['sonyliv']);

        return

    } catch (err) {
        console.log("app parsing function error: ", err.message)
        // console.log(id)
        return
    }
}

module.exports = {
    appLevelParse
}


        // for (let i = 0; i < final_data.length; i++) {
        //     const app_name = final_data[i].app_name

        //     switch (app_name) {

        //         case 'youtube':
        //             youtube_data.push(final_data[i])
        //             break
        //         case 'hotstar':
        //             hotstar_data.push(final_data[i])
        //             break
        //         case 'jio_cinema':
        //             jiocinema_data.push(final_data[i])
        //             break
        //         case 'amazon_prime':
        //             amazonprime_data.push(final_data[i])
        //             break
        //         case 'amazon':
        //             amazon_data.push(final_data[i])
        //             break
        //         case 'flipkart':
        //             flipkart_data.push(final_data[i])
        //             break
        //         case 'jiosaavn':
        //             jiosaavn_data.push(final_data[i])
        //             break
        //         case 'moj':
        //             moj_data.push(final_data[i])
        //             break
        //         case 'myntra':
        //             myntra_data.push(final_data[i])
        //             break
        //         case 'jiomart':
        //             jiomart_data.push(final_data[i])
        //             break
        //         case 'meesho':
        //             meesho_data.push(final_data[i])
        //             break
        //         case 'spotify':
        //             spotify_data.push(final_data[i])
        //             break

        //     }
        // }
