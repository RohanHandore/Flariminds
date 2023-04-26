const { eventTimeFmt } = require("../helpers/event_time_fmt");
const { insertOTTData } = require("../helpers/db");

const mxplayerParse = async (mxplayer_data) => {
  let parsedMxplayerData = [];

  // mxplayer parsing
  for (let k = 0; k < mxplayer_data.length; k++) {
    let y = mxplayer_data[k];
    id = y.id;
    let fmtEventTime = eventTimeFmt(y.event_time);
    let gotData = false;

    let eventData = y.data.split("^text:");
    let i = 0;

    const regex = new RegExp(/^([\d,]+) subscribers/);
    const breaking = new RegExp(/(\d{4})$/);
    let recentSearch = "Recent Searches";
    let list = "My List";
    let share = "Share";

    for (let i = 0; i < eventData.length; i++) {
      // getting data of MOVIE and SERIES being played with descreoption
      {
        if (eventData[i]?.match(regex)) {
          j = i - 1;
          while (j >= 0 && !eventData[j].match(breaking)) {
            j -= 1;
        }
          let movieName = eventData[j-1];
          let channelName = eventData[i - 1];
          parsedMxplayerData.push([
            y.id,
            y.user_id,
            y.app_name,
            "MOVIE_NAME_DESCRIPTIOM",
            movieName,
            fmtEventTime,
          ]);
          parsedMxplayerData.push([
            y.id,
            y.user_id,
            y.app_name,
            "CHANNEL_NAME",
            channelName,
            fmtEventTime,
          ]);
          s = i + 1;
          let genre = new RegExp(/^Genre: /);
          let cast = new RegExp(/^Cast: /);
          let director = new RegExp(/^Director: /);
          let rating = new RegExp(/^Rating: /);
          let language = new RegExp(/^Language: ([A-Za-z]+(?:, )?)+$/);

          while (s < eventData.length) {
            console.log("loop", s);
            if (eventData[s].match(genre)) {
              parsedMxplayerData.push([
                y.id,
                y.user_id,
                y.app_name,
                "GENER",
                eventData[s],
                fmtEventTime,
              ]);
            }

            if (eventData[s].match(cast)) {
              parsedMxplayerData.push([
                y.id,
                y.user_id,
                y.app_name,
                "CAST",
                eventData[s],
                fmtEventTime,
              ]);
            }
            if (eventData[s].match(language)) {
              parsedMxplayerData.push([
                y.id,
                y.user_id,
                y.app_name,
                "LANGUAGE",
                eventData[s],
                fmtEventTime,
              ]);
            }
            if (eventData[s].match(director)) {
              parsedMxplayerData.push([
                y.id,
                y.user_id,
                y.app_name,
                "DIRECTOR",
                eventData[s],
                fmtEventTime,
              ]);
            }
            if (eventData[s].match(rating)) {
              parsedMxplayerData.push([
                y.id,
                y.user_id,
                y.app_name,
                "RATING",
                eventData[s],
                fmtEventTime,
              ]);
            }
            s += 1;
          }
          console.log("loop outside");
        }
   
        /*
                    if (cond1) {
                        let seriesName = eventData[i - 6];
                        let seriesEpsode = eventData[i - 5];
                        let seriesdescription = eventData[i + 2];
                        let language = eventData[i + 3];
                        let Genre = eventData[i + 4];
                        let channelName = eventData[i - 1];
                        let Year = eventData[i - 3];
                        let Cast = eventData[i + 5];
                        let Director = eventData[i + 9];

                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'SERIES_NAME', seriesName, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'SERIES_EPSODE', seriesEpsode, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'DESCREPTION', seriesdescription, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'RELEASE_DATE', Year, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'CHANNEL_NAME', channelName, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'LANGUAGE', language, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'GENERA', Genre, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'CAST', Cast, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'DIRECTOR', Director, fmtEventTime])
                    }
                    if (cond2) {
                        let seriesName = eventData[i - 7];
                        let seriesEpsode = eventData[i - 6];
                        let releaseDate = eventData[i - 4];
                        let channelName = eventData[i - 1];
                        let seriesdescription = eventData[i + 2];

                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'SERIES_NAME', seriesName, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'SERIES_EPSODE', seriesEpsode, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'RELEASE_DATE', releaseDate, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'CHANNEL_NAME', channelName, fmtEventTime])
                        parsedMxplayerData.push([y.id, y.user_id, y.app_name, 'DESCREPTION', seriesdescription, fmtEventTime])
                    }
                    */
      }

      // getting data of recent searches
      {
        if (eventData[i]?.match(recentSearch)) {
          let fill = true;

          let j = i + 2;
          while (fill == true) {
            parsedMxplayerData.push([
              y.id,
              y.user_id,
              y.app_name,
              "RECENT_SEARCHED_CONTENT",
              eventData[j],
              fmtEventTime,
            ]);
            let a = j + 1;
            if (eventData[j + 1] === "Trending Searches" || !eventData[j + 1]) {
              fill = false;
            }
            j++;
          }
        }
      }

      // getting data of MOVIE and SERIS being played without descreoption
      {
        if (eventData[i]?.match(list) || eventData[i + 2]?.match(share)) {
          let series = false;
          if (y.data.includes("Episodes")) {
            series = true;
          }
          const regex3 = new RegExp(/^\d{2}:\d{2}$/);
          const new_regex3 = new RegExp(/S\d+\sE\d+/);
          if (series) {
            s = i - 1;
            while (s >= 0 && !eventData[s].match(new_regex3)) {
              s -= 1;
            }
            if (s >= 1) {
              if (eventData[s - 1].length < 3) {
                parsedMxplayerData.push([
                  y.id,
                  y.user_id,
                  y.app_name,
                  "SERIES_NAME",
                  eventData[s - 2],
                  fmtEventTime,
                ]);
              } else if (eventData[s - 1].length > 3) {
                parsedMxplayerData.push([
                  y.id,
                  y.user_id,
                  y.app_name,
                  "SERIES_NAME",
                  eventData[s - 1],
                  fmtEventTime,
                ]);
              }
              parsedMxplayerData.push([
                y.id,
                y.user_id,
                y.app_name,
                "SERIES_EPSODE",
                eventData[s],
                fmtEventTime,
              ]);
              parsedMxplayerData.push([
                y.id,
                y.user_id,
                y.app_name,
                "UPLOAD_DATE",
                eventData[s + 1],
                fmtEventTime,
              ]);
            }
          } else {
            let description = eventData[i - 3];
            if (description) {
              const arr = description.split(", ");
              const language = arr[0];
              const category = arr[1];
              const release_year = arr[2];
              if (language && category && release_year) {
                parsedMxplayerData.push([
                  y.id,
                  y.user_id,
                  y.app_name,
                  "MOVIE_NAME",
                  eventData[i - 4],
                  fmtEventTime,
                ]);
                parsedMxplayerData.push([
                  y.id,
                  y.user_id,
                  y.app_name,
                  "LANGUAGE",
                  language,
                  fmtEventTime,
                ]);
                parsedMxplayerData.push([
                  y.id,
                  y.user_id,
                  y.app_name,
                  "CATEGORY",
                  category,
                  fmtEventTime,
                ]);
                parsedMxplayerData.push([
                  y.id,
                  y.user_id,
                  y.app_name,
                  "RELESE_DATE",
                  release_year,
                  fmtEventTime,
                ]);
              }
            }
          }
        }
      }

      // getting searched text
      {
        if (eventData[i] === "Navigate up") {
          if (!eventData[i + 1] === "YouTube, online videos") {
            parsedMxplayerData.push([
              y.id,
              y.user_id,
              y.app_name,
              "SEARCHED_TEXT",
              eventData[i + 1],
              fmtEventTime,
            ]);
          }
        }
      }
      console.log("total loop");
    }
  }
  if (parsedMxplayerData.length > 0) {
    await insertOTTData(parsedMxplayerData);
    console.log("data");
  }
};

module.exports = {
  mxplayerParse,
};
