const express = require('express')
const cors = require("cors");
const logger = require("morgan");
const cron = require("node-cron");
const { parseData } = require('./helpers/parseData')
const { appLevelParse } = require('./parsing_functions/appLevelParsing')
const { convertFileToPlainText } = require('./helpers/dataTransaction');
const { TablesName } = require('./helpers/TablesName');
const { checkAndCreateTables } = require('./helpers/createTables')

const app = express()
const port = 8080
app.use(cors())
app.use(express.json())


logger.token('date', function (req, res) {
  return (new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))).toISOString()
})
app.use(logger(":date :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :response-time ms"));

const { userRouter } = require("./routes/userRouter");
const { appsRouter } = require("./routes/appsRouter");
const { rawDataRouter } = require("./routes/rawDataRouter");
const { devRouter } = require("./routes/otherAPIs");
const { csvRouter } = require("./routes/csvRouter");

// const config = require('./dbConfig');
app.use("/rawData", rawDataRouter);
app.use("/user", userRouter);
app.use("/apps", appsRouter);
app.use("/dev", devRouter);
app.use("/csv", csvRouter);

app.get('/', async (req, res) => {
  res.send("hello world")
})

cron.schedule("1 0 * * *", async () => {
    await checkAndCreateTables(TablesName.FILE)
    await checkAndCreateTables(TablesName.DATA_TRANSACTION)
    await checkAndCreateTables(TablesName.EVENT_DATA)
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});


cron.schedule("15 0 * * *", async () => {
    var res = await convertFileToPlainText();
    if (res.error) {
      console.log("Error in converting data")
    } else {
      console.log("Table created")
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// parse raw data
cron.schedule("0 3 * * *", async () => {
    await parseData()
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// parse app-level data
cron.schedule("0 6 * * *", async () => {
    await appLevelParse()
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// cron job test
// cron.schedule("* * * * *", async () => {
//   console.log('cron job running...')
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})