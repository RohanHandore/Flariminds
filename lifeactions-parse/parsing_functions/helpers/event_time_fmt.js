const eventTimeFmt = (eventTime) => {
    if (!eventTime) {
        return null
    }
    const toAddZero = (v) => {
        if (parseInt(v) < 10) {
            return '0'+v
        }
        return v
    }
    var dtDate = toAddZero(eventTime.getDate())
    var dtMonth = toAddZero(eventTime.getMonth() + 1)
    var dtYear = toAddZero(eventTime.getFullYear())
    var hr = toAddZero(eventTime.getHours())
    var mn = toAddZero(eventTime.getMinutes())
    var sc = toAddZero(eventTime.getSeconds())
    var ms = toAddZero(eventTime.getMilliseconds())
    return new Date(`${dtYear}-${dtMonth}-${dtDate}T${hr}:${mn}:${sc}.${ms}+05:30`)
}
module.exports={
    eventTimeFmt
}