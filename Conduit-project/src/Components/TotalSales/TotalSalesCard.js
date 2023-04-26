import { React, useState } from "react";
import styles from "./TotalSalesCard.module.css";
import arrowTop from "../../Assets/arrowTop.svg";
import upArrow from "../../Assets/upArrow.svg";
import data from "./Data";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";

const TotalSalesCard = ({ dashboardData }) => {
    const theme = useSelector((state) => state.theme.mode);
    const [userData, setUserData] = useState({
        data: {
            labels: data.map((data) => data.year),
            datasets: [
                {
                    data: data.map((data) => data.userGain),
                    borderColor: "#09DE85",
                    borderWidth: 1,
                    pointRadius: (ctx) => {
                        const pointsLength = ctx.chart.data.labels.length - 1;
                        const pointsArray = [];

                        for (let i = 0; i <= pointsLength; i++) {
                            if (i === pointsLength) {
                                pointsArray.push(3);
                            } else {
                                pointsArray.push(0);
                            }
                        }
                        return pointsArray;
                    },
                },

                {
                    data: data.map((data) => data.userLoss),
                    borderColor: "#5B5B5B",
                    borderWidth: 1,
                    pointRadius: 0,
                    opacity: 0.7,
                    pointRadius: (ctx) => {
                        const pointsLength = ctx.chart.data.labels.length - 1;
                        const pointsArray = [];

                        for (let i = 0; i <= pointsLength; i++) {
                            if (i === pointsLength) {
                                pointsArray.push(3);
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
        <>
            <div className={`row ${styles.container} ${theme === "dark" ? styles.darkContainer : ''}`}>
				<div className={`col-6 ${styles.textPart}`}>
					<div className={styles.headContainer}>
						<span className={styles.main}>Total Sales</span>
						<span className={styles.sub}>
							See all sales &gt;
						</span>
						<h5 className={`${styles.dateText} ${theme == 'dark' ? styles.darkDateText : ''}`}>
							Jan 1, 2023 - Feb 28, 2023
						</h5>
					</div>

					<div className={styles.totalSalesBottom}>
						<h5 className={styles.priceCap}>
							{dashboardData?.order_reports.data.total_sales}
						</h5>
						<div className={styles.past}>
							<img src={upArrow} alt="arrow" />
							<span className={styles.rate}>9.2%</span> vs 6 months before
						</div>
					</div>
				</div>

                <div className={` col-6  ${styles.chartPart}`}>
                    <Line data={userData.data} options={userData.options} />
                </div>
            </div>
        </>
    );
};

export default TotalSalesCard;
