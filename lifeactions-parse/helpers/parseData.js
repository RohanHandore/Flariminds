const { config } = require('../dbConfig/dbConfigMySQL')
const { TablesName } = require('./TablesName')

const eventTimeToDate = (eventTime) => {
    if (!eventTime) {
        return null
    }
    const toAddZero = (v) => {
        if (parseInt(v) < 10) {
            return '0' + v
        }
        return v
    }
    const a = eventTime.split(':')
    var dt = a[0].split('-')
    var dtDate = toAddZero(dt[2])
    var dtMonth = toAddZero(dt[1])
    var dtYear = toAddZero(dt[0])
    var hr = toAddZero(a[1])
    var mn = toAddZero(a[2])
    var sc = toAddZero(a[3])
    var ms = toAddZero(a[4])
    return process.env.LOCALSERVER ? `${dtYear}-${dtMonth}-${dtDate}T${hr}:${mn}:${sc}.${ms}+05:30`
        : `${dtYear}-${dtMonth}-${dtDate}T${hr}:${mn}:${sc}.${ms}`
}

const parseData = async () => {
    try {
        // const today = new Date()
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
        const prevDay = new Date(today.setDate(today.getDate()))
        var suffix = `${prevDay.getDate()}_${prevDay.getMonth() + 1}_${prevDay.getFullYear()}`
        let tableName = `data_transaction_${suffix}`

        var appsList = []
        let getAppsPromise = new Promise(function (resolve, reject) {
            var query = `select app_name, packageName, category_name, apps_m.category_id, app_id from apps_m left join app_category_m on apps_m.category_id = app_category_m.id`;
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
        appsList = await getAppsPromise

        var rawData = []
        let getRawDataPromise = new Promise(function (resolve, reject) {
            var query = `select * from ${tableName} order by id`;
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
        rawData = await getRawDataPromise

        let fnlDataTblName = `${TablesName.EVENT_DATA}_${suffix}`

        //For deleting any data in the final table at testing stage
        var del_event_data
        let delEventDataPromise = new Promise(function (resolve, reject) {
            var query = `delete from ${fnlDataTblName}`;
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
        del_event_data = await delEventDataPromise

        // let isTbl = await checkTable(fnlDataTblName)
        // if (!isTbl.error) {
        //     if (!isTbl.tableFound) {
        //         await createNewTable(fnlDataTblName, TablesName.EVENT_DATA);
        //     } else if (isTbl.tableFound) {
        //         console.log('Table with same name found of type ', TablesName.EVENT_DATA);
        //     }
        // }

        //selecting all event patterns from the initial table
        var data_patterns
        let getDataPatternsPromise = new Promise(function (resolve, reject) {
            var query = `select * from event_info_m`;
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
        data_patterns = await getDataPatternsPromise

        //Joining Tables event_info_m , apps_m , apps_category_m according to app id  
        var eventsInfoMaster
        let getEventsInfoMasterPromise = new Promise(function (resolve, reject) {
            var query = `select acm.category_name, am.app_name, am.app_id, am.category_id, dpm.id, dpm.name as 'pattern_info', dpm.event_info, am.packageName
                    from event_info_m as dpm
                    left join apps_m as am on am.app_id = dpm.app_id
                    left join app_category_m acm on acm.id = am.category_id`;
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
        eventsInfoMaster = await getEventsInfoMasterPromise

        let values = []
        //Looping through all the rows in data_transaction table for a paticular day
        for (let i = 0; i < rawData.length; i++) {
            let d = rawData[i]
            // if(d.id !== 1861) continue
            let str = d.data

            if (str.includes('~NewEvent:')) {
                let events = str.split('~NewEvent:')
                for (let j = 0; j < events.length; j++) {
                    let eventInfoIndex = events[j].indexOf('event_info^')
                    var dataIndex = events[j].indexOf('^data^')
                    var eventTimeIndex = events[j].indexOf('^event_time^')
                    if (eventInfoIndex != -1 && dataIndex != -1 && eventTimeIndex != -1) {
                        let event_info = events[j].substring(eventInfoIndex + 11, dataIndex)
                        let data = events[j].substring(dataIndex + 6, eventTimeIndex)
                        let event_time = events[j].substring(eventTimeIndex + 12)

                        var pckgName = event_info.split('*')[0].trim()
                        let ctid = appsList.find(a => a.packageName == pckgName)?.category_id
                        var appid = appsList.find(a => a.packageName == pckgName)?.app_id

                        if (data != '' && data != 'null') {
                            data = {
                                data_transaction_id: d.id,
                                user_id: d.user_id,
                                category_id: ctid ? ctid : null,
                                app_id: appid ? appid : null,
                                pattern_id: null,
                                eventInfo: event_info,
                                packageName: pckgName,
                                data: data,
                                eventTime: event_time
                            }
                        } else {
                            data = null
                        }
                        if (data) {
                            let thisData = [
                                data.data_transaction_id, data.user_id, data.category_id, data.app_id,
                                data.pattern_id, data.eventInfo, data.packageName, data.data,
                                new Date(eventTimeToDate(data.eventTime))
                            ]
                            values.push(thisData)
                        }
                    }
                }
            } else {
                // parse usage stats data
                await parseUsageStatsData(str, d.id, d.user_id)
            }
        }
        if (values.length > 0) {
            var query = `insert into ${fnlDataTblName}(data_transaction_id, user_id, category_id,
                app_id, pattern_id, event_info, package_name, data, event_time) values ?`;
            config.query(query, [values], function (err, result) {
                if (err) {
                    console.log(err.message)
                }
                if (result && result.affectedRows > 0) {
                    console.log('Data parsed successfully')
                }
            })
        }
    } catch (err) {
        console.log("parse error: ", err.message)
    }
}

const parseUsageStatsData = async (str, transaction_id, user_id) => {
    try {
        // let str = `DeviceID
        // 559dc1474ea8a170
        // GoogleAdId

        // TELECOM
        // airtel
        // PHONE_BRAND
        // samsung
        // MODEL_NAME
        // SM-A536E
        // USAGE_STATS
        // com.skype.raider*1; com.truecaller*1; in.redbus.android*0; org.telegram.messenger*0; com.phonepe.app*0; com.shazam.android*0; com.plexapp.android*0; com.mgoogle.android.gms*0; com.miniclip.eightballpool*0; com.boi.mpay*0; com.myairtelapp*0; com.whatsapp*31; com.aswin.reactnative.animations*0; com.sec.android.app.voicenote*0; com.hobi.android*0; com.vanced.manager*0; com.bsbportal.music*0; com.microsoft.office.excel*0; in.amazon.mShop.android.shopping*30; cris.icms.ntes*0; com.wemagineai.voila*6; in.org.npci.upiapp*0; com.aerotools.photo.sketch.maker.editor*0; com.instagram.android*83; com.wott*0; com.samsung.android.app.tips*0; ch.protonvpn.android*0; com.vanced.android.youtube*76; com.supercell.clashofclans*36; com.olacabs.customer*0; com.microsoft.office.outlook*0; org.adaway*0; com.wg.xvideos.app*0; com.easyplexdemo*0; com.stuff.todo*0; com.wemagineai.citrus*2; com.example.liveaction_ext*0; com.mxtech.videoplayer.ad*0; com.bigwinepot.nwdn.international*0; com.internet.speed.meter.lite*0; com.google.android.apps.docs*0; com.microsoft.office.word*0; org.fdroid.fdroid*0; com.xc3fff0e.xmanager*0; com.google.android.videos*0; com.netflix.mediaclient*0; tv.accedo.airtel.wynk*0; com.google.android.apps.photos*0; com.spotify.music*5; com.hierlsoftware.picsort*0; photoeditor.layout.collagemaker*0; com.ubercab*0; com.sec.android.app.sbrowser*2; com.microsoft.office.officehubrow*0; com.application.zomato*0; com.womboai.wombodream*0; com.facebook.katana*0; com.amazon.avod.thirdpartyclient*109; com.bt.bms*3; com.instapro.android*0; com.hsv.freeadblockerbrowser*16; com.splendapps.splendo*0; com.sec.android.app.popupcalculator*0; com.chess*0; com.sec.android.app.shealth*0; com.grofers.customerapp.lit*0; com.sec.android.app.kidshome*0; com.samsung.android.app.notes.addons*0; com.linkedin.android*0; com.google.android.apps.nbu.paisa.user*14; com.samsung.android.spay*0; com.samsung.android.app.notes*0; com.grofers.customerapp*0; com.myntra.android*0; com.trello*0; com.sec.android.easyMover*0; com.bumble.app*0; gr.gamebrain.comica*0; com.rapido.passenger*0; com.digilocker.android*0; in.swiggy.android*0; com.thmobile.sketchphotomaker*2; com.ryzenrise.storyart*0; com.adobe.lrmobile*0; com.aranoah.healthkart.plus*0; com.google.android.play.games*0; com.dualspace.multispace.android*0; at.juggle.imagegrid*0; com.snapchat.android*16;`
        let deviceIdIndex = str.indexOf('DeviceID')
        let googleAdIdIndex = str.indexOf('GoogleAdId')
        let telecomIndex = str.indexOf('TELECOM')
        let phoneBrandIndex = str.indexOf('PHONE_BRAND')
        let modelNameIndex = str.indexOf('MODEL_NAME')
        let usageStatsIndex = str.indexOf('USAGE_STATS')
        let eventTimeIndex = str.indexOf('EVENT_TIME')

        let deviceID = str.substring(deviceIdIndex + 8, googleAdIdIndex).replace(/\n/g, '').trim()
        let googleAdId = str.substring(googleAdIdIndex + 10, telecomIndex).replace(/\n/g, '').trim()
        let telecom = str.substring(telecomIndex + 7, phoneBrandIndex).replace(/\n/g, '').trim()
        let phoneBrand = str.substring(phoneBrandIndex + 11, modelNameIndex).replace(/\n/g, '').trim()
        let modelName = str.substring(modelNameIndex + 10, usageStatsIndex).replace(/\n/g, '').trim()
        let usageStats = str.substring(usageStatsIndex + 11, eventTimeIndex).replace(/\n/g, '').trim()
        let eventTime = str.substring(eventTimeIndex + 10).replace(/\n/g, '').trim()

        let values = [[transaction_id, user_id, deviceID, googleAdId, telecom, phoneBrand, modelName, usageStats, new Date(eventTimeToDate(eventTime))]]
        let insertUsageStats = new Promise(function (resolve, reject) {
            var query = `insert into usage_stats(data_transaction_id, user_id, device_id,
                google_ad_id, telecom, phone_brand, model_name, apps_usage, event_time) values ?`;
            config.query(query, [values], function (err, result) {
                if (err) {
                    console.log("Error in inserting usage stats data:", err.message)
                    reject(err)
                }
                if (result && result.affectedRows > 0) {
                    // console.log('Usage stats data inserted')
                    resolve(result)
                }
            })
        })
        await insertUsageStats
        return
    } catch (error) {
        console.log('Error in usage stats:', error.message)
        return
    }
}

module.exports = {
    parseData
}