import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Live.module.css";
import SideBar from "../../../Components/SideBar/SideBar";
import Calender from "../../../Components/Calender/Calender";
import Export from "../../../Components/Export/Export";
import Goback from "../../../Components/GoBack/Goback";
import CustomerStatus from "../../../Components/CustomerStatus/CustomerStatus";
import CustomerStatusChart from "../../../Components/CustomerStatusChart/CustomerStatusChart";
import HeaderLayout from "../../../Layouts/HeaderLayout/HeaderLayout";
import data from "../Data";
import Chat from "../../../Components/Chat/Chat";
import ChatData from "../ChatData.js"



const Live = () => {
    const [userData, setUserData] = useState({
        data: {
            labels: data.map((data) => data.year),
            datasets: [
                {
                    data: data.map((data) => data.userGain),
                    borderColor: "#09DE85",
                    backgroundColor: "rgba(9, 222, 133, 0.06)",
                    borderWidth: 1,
                    fill: true,
                    pointRadius: (ctx) => {
                        const pointsLength = ctx.chart.data.labels.length - 1;
                        const pointsArray = [];
                        for (let i = 0; i <= pointsLength; i++) {
                            if (i === pointsLength) {
                                pointsArray.push(0);
                            } else {
                                pointsArray.push(0);
                            }
                        }
                        return pointsArray;
                    },
                },
            ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: -7,
                    right: 0,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                    border: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    },
                },
            },
        },
    });

    const [sidebar, setSidebar] = useState(true);
    const theme = useSelector((state) => state.theme.mode);

    return (
        <div
            className={
                theme === "dark"
                    ? `container-fluid  ${styles.dark_live}`
                    : `container-fluid  ${styles.light_live}`
            }
        >
            <div className="row">
                <div className={sidebar ? "col-4 col-md-2 " : "col-1"}>
                    <SideBar sidebar={sidebar} setSidebar={setSidebar} />
                </div>

                <div className={sidebar ? "col-8 col-md-10" : "col-11"}>
                    {/* <div className={`row ${styles.head}`}>
              <h5 className={`col-4 col-xl-5 ${styles.title}`}>Customer Status</h5>

              <div className={`col-8 col-xl-6`} >
                <div className={`row ${styles.dateAndExport} `}>
                <div className="col-9 ">
                  <Calender />
                </div>
                <div className="col-3 ">
                  <Export />
                </div>
                </div>
              </div>
            </div> */}

                    <div className={styles.container}>
                     <HeaderLayout title={'Customer Status'} />

                        <div className={`row `}>
                            <div className={`col-10 col-md-4 col-lg-3 ${styles.goBackContainer}`}>
                                <Goback />
                            </div>
                            <br />
                        </div>

                        <CustomerStatus className="p-0" />

                        <div className={`row p-0 ${styles.card}`}>
                            <div className={`col-2 col-lg-3 ${styles.chartBox}`}>
                                <CustomerStatusChart
                                    title="GMV"
                                    value="10325.90"
                                    sign="$"
                                    reportResult="+1.5"
                                    reportStatus="Higher earning than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                            <div
                                className={`col-2 col-lg-3 ${styles.chartBox}`}
                            >
                                <CustomerStatusChart
                                    title="No. of Visitors"
                                    value="10325.90"
                                    sign=""
                                    reportResult="-1.5"
                                    reportStatus="Lower visitors than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                            <div
                                className={`col-2 col-lg-3 ${styles.chartBox}`}
                            >
                                <CustomerStatusChart
                                    title="No. of Customers"
                                    value="10325.90"
                                    sign=""
                                    reportResult="+1.5"
                                    reportStatus="Higher earning than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                            <div
                                className={`col-2 col-lg-3 ${styles.chartBox}`}
                            >
                                <CustomerStatusChart
                                    title="% of Orders with Alliance Products"
                                    value="10325.90"
                                    sign="%"
                                    reportResult="+1.5"
                                    reportStatus="Higher earning than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                            <div
                                className={`col-2 col-lg-3 ${styles.chartBox}`}
                            >
                                <CustomerStatusChart
                                    title="GMV"
                                    value="10325.90"
                                    sign="$"
                                    reportResult="+1.5"
                                    reportStatus="Higher earning than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                            <div
                                className={`col-2 col-lg-3 ${styles.chartBox}`}
                            >
                                <CustomerStatusChart
                                    title="No. of Visitors"
                                    value="10325.90"
                                    sign=""
                                    reportResult="-1.5"
                                    reportStatus="Lower visitors than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                            <div
                                className={`col-2 col-lg-3 ${styles.chartBox}`}
                            >
                                <CustomerStatusChart
                                    title="No. of Customers"
                                    value="10325.90"
                                    sign=""
                                    reportResult="+1.5"
                                    reportStatus="Higher earning than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                            <div
                                className={`col-2 col-lg-3 ${styles.chartBox}`}
                            >
                                <CustomerStatusChart
                                    title="% of Orders with Alliance Products"
                                    value="10325.90"
                                    sign="%"
                                    reportResult="+1.5"
                                    reportStatus="Higher earning than usual"
                                    data={userData.data}
                                    options={userData.options}
                                />
                            </div>
                        </div>

                        <div className="row " >
                            <div className={`col p-0 ${styles.chatContainer}`}>
                                <Chat ChatData={ChatData} />
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Live;
