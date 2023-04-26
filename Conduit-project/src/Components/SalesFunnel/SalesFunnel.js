import React, { useState } from "react";
import styles from "./SalesFunnel.module.css";
import data from "./Data";
import { Line } from "react-chartjs-2";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useSelector } from "react-redux";

Chart.register(CategoryScale);

const dummyData = {
    number: "73247",
    percent: "19.23%",
}

const GraphComponent = ({ title, userData, data }) => {
    return (
        <div>
            <div className={styles.vertical_line}></div>
            <div className={styles.lineGap}>
                <div className={styles.funnelStatTitle}>{title}</div>
                <div className={styles.funnelStatPrice}>{data}</div>
                <div className={`row`}>
                    <div className={`col-8 ${styles.statsContainer}`}>
                        <div className={styles.funnelStatActivity}>No Shopping Activity</div>
                        <div className={styles.funnelStatValue}>73,247</div>
                    </div>
                    <div className={`col-4 ${styles.funnelStatPercent}`}>{dummyData.percent}</div>
                </div>
            </div>
            <div>
                <Line data={userData.data} options={userData.options} className={styles.line} />
            </div>
        </div>
    )
}

const SalesFunnel = ({ dashboardData }) => {
    const theme = useSelector((state) => state.theme.mode);
    const [userData, setUserData] = useState({
        data: {
            labels: data.map((data) => data.year),
            datasets: [
                {
                    data: data.map((data) => data.userGain),
                    borderColor: "#09DE85",
                    backgroundColor: "#09DE85",
                    borderWidth: 1,
                    fill: true,
                    tension: 0.3,
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
                // {
                //   data:[
                //     { x:"1st", y:0},
                //     { x:"2nd", y:0},
                //     { x:"3rd", y:0},
                //     { x:"4th", y:0},
                //     { x:"5th", y:0},
                //     { x:"7th", y:0},
                //   ],
                //   backgroundColor:"green",
                //   borderColor:"green",
                //   borderWidth:1,
                //   fill:0,
                //   radius:0
                // },
                // {
                //   data:[
                //     { x:"7th", y:0},
                //     { x:"8th", y:0},
                //     { x:"9th", y:0},
                //     { x:"10th", y:0},
                //   ],
                //   backgroundColor:"red",
                //   borderColor:"red",
                //   borderWidth:1,
                //   fill:0,
                //   radius:0
                // },
            ],
        },

        options: {
            layout: {
                padding: {
                    left: -10,
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

    return (
        <div className={`${styles.container} ${theme === "dark" ? styles.darkContainer : ''}`}>
            <div>
                <div className={styles.heading}>Sales Funnel</div>
                <div className={styles.subHeading}>Jan 1, 2023 - Jan 29, 2023</div>
            </div>
            <div className="col-12">
                <div>
                    <div className={styles.chartPart}>
                        <div className={`row`}>
                            <div className={`col-4  ${styles.chartMakeOver}`}>
                                <GraphComponent title={'Pre-Agreement'} data={dashboardData?.stores_reports.data.pre_agreement} userData={userData} />
                            </div>
                            <div className={`col-4  ${styles.chartMakeOver}`}>
                                <GraphComponent title={'In-Flight'} data={dashboardData?.stores_reports.data.in_flight} userData={userData} />
                            </div>
                            <div className={`col-4  ${styles.chartMakeOver}`}>
                                <GraphComponent title={'Live'} data={dashboardData?.stores_reports.data.live} userData={userData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesFunnel;
