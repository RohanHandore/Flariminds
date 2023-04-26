const { eventTimeFmt } = require("../helpers/event_time_fmt");
const { insertOTTData } = require("../helpers/db");

const hoichoiParse = async (hoichoi_data) => {
  try {
    let parsedHoichoiData = [];
    //console.log('cart intro')

    // Hoichoi Parsing
    for (let k = 0; k < hoichoi_data.length; k++) {
      let y = hoichoi_data[k];
      let fmtEventTime = eventTimeFmt(y.event_time);
      let gotData = false;
      //console.log('cart intro3')

      var eventData;
      // if (gotData) {
      //     continue
      // }

      // Movie Title clicked/Watching
      {
        let play = new RegExp(/^Watchlist/gm);
        let download = new RegExp(/^Download/gm);
        let star = new RegExp(/^STARRING/gm);
        let director = new RegExp(/^DIRECTOR/gm);
        let certificate = new RegExp(/^U\/A \d+|^U/gm);
        let dot = new RegExp(/^\.$/gm);
        let year = new RegExp(/^\d{4}$/gm);
        let time = new RegExp(/^\d+ mins|^\d+ hour/gm);
        console.log("movie 1");
        // For Clicked screen
        if (y.data.includes("Watchlist") && y.data.includes("Share")) {
          let show = false;
          if (y.data.includes("Episodes") || y.data.includes("Season")) {
            show = true;
          }
          eventData = y.data.split("^text:");
          eventData = eventData.filter((e) => e != "");
          let l = eventData.length;

          for (let i = 0; i < l; i++) {
            if (eventData[i].match(play)) {
              s = i - 1;
              while (s >= 0) {
                if (eventData[s].match(certificate)) {
                  if (show) {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "SERIES_CERTIFICATION",
                      eventData[s],
                      fmtEventTime,
                    ]);
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "SERIES_TITLE",
                      eventData[s - 1],
                      fmtEventTime,
                    ]);
                  } else {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "MOVIE_CERTIFICATION",
                      eventData[s],
                      fmtEventTime,
                    ]);
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "MOVIE_TITLE",
                      eventData[s - 1],
                      fmtEventTime,
                    ]);
                  }
                } else if (eventData[s].match(star)) {
                  if (show) {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "SERIES_STARS",
                      eventData[s + 1],
                      fmtEventTime,
                    ]);
                  } else {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "MOVIE_STARS",
                      eventData[s + 1],
                      fmtEventTime,
                    ]);
                  }
                } else if (eventData[s].match(director)) {
                  if (show) {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "SERIES_DIRECTOR",
                      eventData[s + 1],
                      fmtEventTime,
                    ]);
                  } else {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "MOVIE_DIRECTOR",
                      eventData[s + 1],
                      fmtEventTime,
                    ]);
                  }
                } else if (
                  eventData[s].length > 50 &&
                  !eventData[s - 1].match(star) &&
                  !eventData[s - 1].match(director)
                ) {
                  if (show) {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "SERIES_DESCRIPTION",
                      eventData[s],
                      fmtEventTime,
                    ]);
                  } else {
                    parsedHoichoiData.push([
                      y.id,
                      y.user_id,
                      y.app_name,
                      "MOVIE_DESCRIPTION",
                      eventData[s],
                      fmtEventTime,
                    ]);
                  }
                } else if (eventData[s].length == 1) {
                  //console.log('dotttttttt')
                  if (eventData[s + 1].match(year)) {
                    if (show) {
                      parsedHoichoiData.push([
                        y.id,
                        y.user_id,
                        y.app_name,
                        "SERIES_RELEASE_YEAR",
                        eventData[s + 1],
                        fmtEventTime,
                      ]);
                    } else {
                      parsedHoichoiData.push([
                        y.id,
                        y.user_id,
                        y.app_name,
                        "MOVIE_RELEASE_YEAR",
                        eventData[s + 1],
                        fmtEventTime,
                      ]);
                    }
                  } else if (eventData[s + 1].match(time)) {
                    if (show) {
                      parsedHoichoiData.push([
                        y.id,
                        y.user_id,
                        y.app_name,
                        "SERIES_LENGTH",
                        eventData[s + 1],
                        fmtEventTime,
                      ]);
                    } else {
                      parsedHoichoiData.push([
                        y.id,
                        y.user_id,
                        y.app_name,
                        "MOVIE_LENGTH",
                        eventData[s + 1],
                        fmtEventTime,
                      ]);
                    }
                  } else {
                    if (show) {
                      parsedHoichoiData.push([
                        y.id,
                        y.user_id,
                        y.app_name,
                        "SERIES_GENRE",
                        eventData[s + 1],
                        fmtEventTime,
                      ]);
                    } else {
                      parsedHoichoiData.push([
                        y.id,
                        y.user_id,
                        y.app_name,
                        "MOVIE_GENRE",
                        eventData[s + 1],
                        fmtEventTime,
                      ]);
                    }
                  }
                }
                s -= 1;
              }
            }
          }
        }
      }
    }

    if (parsedHoichoiData.length > 0) {
      await insertOTTData(parsedHoichoiData);
    }
    return;
  } catch (err) {
    console.log("hoichoi Parsing Error: ", err.message);
    return;
  }
};
module.exports = {
  hoichoiParse,
};
