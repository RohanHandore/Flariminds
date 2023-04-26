const { eventTimeFmt } = require("../helpers/event_time_fmt");
const { insertOTTData } = require("../helpers/db");

const sonyLivParse = async (sonyLiv_data) => {
  let parsedSonyLivData = [];

  for (let k = 0; k < sonyLiv_data.length; k++) {
    let y = sonyLiv_data[k];
    id = y.id;
    let fmtEventTime = eventTimeFmt(y.event_time);
    let gotData = false;

    let eventData = y.data.split("^text:");
    let i = 0;

    const epsode = new RegExp(/^E\s\d+\./);
    const watching = new RegExp(/^Report$/);
    const recentSearch = "delete recent search";

    for (let i = 0; i < eventData.length; i++) {
      // getting data of MOVIE and TV SHOWS
      {
        if (eventData[i]?.match(watching)) {
          let video = eventData[i + 1];
          let desc = eventData[i + 2];
          if (video && desc) {
            parsedSonyLivData.push([
              y.id,
              y.user_id,
              y.app_name,
              "VIDEO_NAME",
              video,
              fmtEventTime,
            ]);
            if (desc?.match(epsode)) {
              desc = eventData[i + 3];
              let videoEpsode = eventData[i + 2];
              parsedSonyLivData.push([
                y.id,
                y.user_id,
                y.app_name,
                "VIDEO_EPSODE",
                videoEpsode,
                fmtEventTime,
              ]);
            }
            if (desc !== "Home" && desc !== "Watch Now") {
              parsedSonyLivData.push([
                y.id,
                y.user_id,
                y.app_name,
                "VIDEO_DESCRIPTION",
                desc,
                fmtEventTime,
              ]);
            }
          }
        }
      }
      // getting data of searched movie and seires
      {
        if (eventData[i] === recentSearch) {
          parsedSonyLivData.push([
            y.id,
            y.user_id,
            y.app_name,
            "SEARCHED_CONTENT",
            eventData[i - 1],
            fmtEventTime,
          ]);
        }
      }
    }
  }

  if (parsedSonyLivData.length > 0) {
    // console.table(parsedSonyLivData)
    await insertOTTData(parsedSonyLivData);
    console.log("data");
  }
};

module.exports = {
  sonyLivParse,
};
