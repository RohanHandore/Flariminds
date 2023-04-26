import { React, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./DistributerBirdView.module.css";
import { DistributorEyeCard } from "../../../Components/DistributorEyeCard/DistributorEyeCard.js";
import { DistributedVerticalCard } from "../../../Components/DistributedVerticalCard/DistributedVerticalCard";
import DistributedSvg from "../../../Assets/activity.svg";
import DollarSvg from "../../../Assets/dollar-square.svg";
import ChartSvg from "../../../Assets/chart-21.svg";
import cartSvg from "../../../Assets/shoppingCart.svg";
import walletSvg from "../../../Assets/wallet.svg";
import unCart from "../../../Assets/uncart.svg";
import avatar from "../../../Assets/distAvatar.svg";
import searchIcon from "../../../Assets/search.svg";
import notificationSvg from "../../../Assets/notification.svg";
import profileSvg from "../../../Assets/profile.svg";

import TotalCost from "../../../Assets/DistributedView/newTotalCost.svg";
import Cart from "../../../Assets/DistributedView/newCart.svg";
import TotalProfit from "../../../Assets/DistributedView/newTotalProfit.svg";
import TotalRevenue from "../../../Assets/DistributedView/newTotalRevenue.svg";
import TotalSales from "../../../Assets/DistributedView/newTotalSales.svg";
import UniqueCard from "../../../Assets/DistributedView/newUniqueCard.svg";

import data from "../YearData.js";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import SideBar from "../../../Components/SideBar/SideBar";
Chart.register(CategoryScale);

export const DistributerBirdView = () => {
  const theme = useSelector((state) => state.theme.mode);
  const [sidebar, setSidebar] = useState(true);
  const [salesData, setSalesData] = useState({
    data: {
      labels: data.map((data) => data.month),
      datasets: [
        {
          data: data.map((data) => data.sales),
          borderColor: "#00F6A3",
          backgroundColor:"#1D3A39",
          borderWidth: 3,
          fill: false,
          tension: 0.5,
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
        {
          data: data.map((data) => data.profits),
          borderColor: "#F74C4C",
          borderWidth: 3,
          fill: false,
          tension: 0.5,
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
        {
          data: data.map((data) => data.growth),
          borderColor: "#02E7FF",
          borderWidth: 3,
          fill: false,
          tension: 0.5,
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
      layout: {
        padding: {
          left: 0,
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
            display: true,
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

  const dataTableHeaders = [
    "Product Sales",
    "Sales",
    "Record Point",
    "Stock",
    "Amount",
    "Stock Status",
  ];

  const dataTableContent = [
    {
      h1: "Adidas Football Shoe",
      p1: "342",
      p2: "03",
      p3: "840",
      p4: "$480.91",
      stock: "In Stock",
    },
    {
      h1: "Adidas Football Shoe",
      p1: "342",
      p2: "03",
      p3: "840",
      p4: "$480.91",
      stock: "In Stock",
    },
    {
      h1: "Adidas Football Shoe",
      p1: "342",
      p2: "03",
      p3: "840",
      p4: "$480.91",
      stock: "Out Of Stock",
    },
    {
      h1: "Adidas Football Shoe",
      p1: "342",
      p2: "03",
      p3: "840",
      p4: "$480.91",
      stock: "In Stock",
    },
    {
      h1: "Adidas Football Shoe",
      p1: "342",
      p2: "03",
      p3: "840",
      p4: "$480.91",
      stock: "Out Of Stock",
    },
    {
      h1: "Adidas Football Shoe",
      p1: "342",
      p2: "03",
      p3: "840",
      p4: "$480.91",
      stock: "Out Of Stock",
    },
    {
      h1: "Adidas Football Shoe",
      p1: "342",
      p2: "03",
      p3: "840",
      p4: "$480.91",
      stock: "Out Of Stock",
    },
  ];

  const storesList = [
    {
      img: avatar,
      name: "James Corde Stores",
      mail: "jamescorde@gmail.com",
    },
    {
      img: avatar,
      name: "Naomi Cabell Stores",
      mail: "naomicabell@gmail.com",
    },
    {
      img: avatar,
      name: "Ilama Swarovski Stores",
      mail: "ilamaswarovskigmail.com",
    },
    {
      img: avatar,
      name: "Katy Bella Stores",
      mail: "katybella@gmail.com",
    },
    {
      img: avatar,
      name: "Becca Stone Stores",
      mail: "beccastone@gmail.com",
    },
  ];

  return (
    <div
      className={
        theme === "dark"
          ? `container-fluid  ${styles.dark_integration}`
          : `container-fluid  ${styles.light_integration}`
      }
    >
      <div className="row">
        <div className={sidebar ? "col-2 col-md-2 " : "col-1"}>
          <SideBar sidebar={sidebar} setSidebar={setSidebar} />
        </div>
 
        <div className={sidebar ? "col-8 col-md-10" : "col-11"}>
          <div className={`container-fluid ${styles.distributedContainer}`}>
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center ">
                <div className={ theme === "dark" ? `${styles.allianceCardDark}` : `${styles.allianceCardLight}`}>
                  Alliance Entertainment
                </div>
                <Link style={{ textDecoration: "none" }} to="/">
                  <div className={styles.dashbordBtn}>Dashboard</div>
                </Link>
              </div>
              <div className="d-flex">
                <img
                  src={searchIcon}
                  alt="search-icon"
                  className={styles.navIcons}
                />
                <img
                  src={notificationSvg}
                  alt="notificationSvg"
                  className={styles.navIcons}
                />
                <img
                  src={profileSvg}
                  alt="profileSvg"
                  className={styles.navIcons}
                />
                <div className="d-flex flex-column text-white">
                  <div className={styles.userName} >Rahul</div>
                  <small className={styles.role}>Admin</small>
                </div>
              </div>
            </div>
            <div className="row">
              <div className={"col-12"}>
                <div className={`row my-4 ${styles.cardBody}`}>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-6">
                        <div className={`row ${styles.distributedStatus} `}>
                          <div className="col-8 col-sm-6 col-lg-4 p-0">
                            <div className={styles.circleBorder}>
                              <div className={styles.circle}></div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-lg-8">
                            <div className="row">
                              <div className="col">
                                <div className={styles.statusTitle}>Score Status</div>
                                <div className={styles.statusText}>Really Good</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <DistributorEyeCard
                          img={TotalSales}
                          heading="Total Sales"
                          stats="$314K"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <DistributorEyeCard
                          img={TotalProfit}
                          heading="Total Profit"
                          stats="$30K"
                        />
                      </div>
                      <div className="col-6">
                        <DistributorEyeCard
                          img={TotalCost}
                          heading="Total Cost"
                          stats="146"
                        />
                      </div>
                      <div className="col-6">
                        <DistributedVerticalCard
                          src={UniqueCard}
                          heading="Unique Carts"
                          stats="3447"
                          hike="9"
                        />
                      </div>
                      <div className="col-6">
                        <DistributedVerticalCard
                          src={TotalRevenue}
                          heading="Today’s Revenue"
                          stats="$345.90"
                          hike="-5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-12">
                        <div className={theme === "dark" ? `${styles.earningCardDark}`: `${styles.earningCardLight}`}>
                          <div
                            className={`d-flex justify-content-between align-items-center `}
                          >
                            <div className={styles.earningCardHeader}>Earnings</div>
                            <div>
                              <ul className={`d-flex align-items-center m-0 ${styles.listBox}`}>
                                <li className={`text-success ${styles.earningList}`}>
                                  <span className="">Sales</span>
                                </li>
                                <li className={`text-warning ${styles.earningList}`}>
                                  <span >Profits</span>
                                </li>
                                <li className={`text-danger ${styles.earningList}`}>
                                  <span >Growth</span>
                                </li>
                              
							<li style={{listStyle:"none"}}>
							<select name="cars" id="cars" className={styles.earningDropdown}>
                            	<option value="2023">2023</option>
                            	<option value="2022">2022</option>
  							</select>
							</li>
             </ul>
					</div>
                          </div>
                          <div className="row">
                            <h3 className={`col-2 ${styles.earningValue}`}>$22,800</h3>
                          </div>
                          <div className={`row ${styles.chartBox}`}>
                            <div className="col">
                              <Line
                                data={salesData.data} 
                                options={salesData.options}
                                className={styles.chart}
                              />
                            </div>
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <DistributedVerticalCard
                          src={Cart}
                          heading="Abandoned Carts"
                          stats="3447"
                          hike="9"
                        />
                      </div>
                      <div className="col-6">
                        <div className={ theme === "dark" ? `${styles.distributedSalesCardDark}` : `${styles.distributedSalesCardLight}`}>
                          <div className={styles.salesHeader}>Total Sales By Stores</div>
                          <h4 className={styles.salesHeader}>$22,800</h4>
                          <div className={`progress ${styles.multiProgress}`}>
                            <div
                              className={`progress-bar bg-success ${styles.progressBar}`}
                              role="progressbar"
                              aria-label="Segment one"
                              style={{ width: "50%" }}
                              aria-valuenow="15"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              type={"range"}
                            ></div>
                            <div
                              className={`progress-bar bg-warning ${styles.progressBar}`}
                              role="progressbar"
                              aria-label="Segment two"
                              style={{ width: "25%" }}
                              aria-valuenow="30"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                            <div
                              className={`progress-bar bg-danger ${styles.progressBar}`}
                              role="progressbar"
                              aria-label="Segment three"
                              style={{ width: "25%" }}
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>

                          <ul className="row d-flex p-0 justify-content-around m-0 p-0">
                            <li className={` col-2 text-success m-0 p-0 ${styles.storesListItem}` }>
                              <span >Sales</span>
                            </li>
                            <li className={` col-2 text-warning m-0 p-0 ${styles.storesListItem}` }>
                              <span >Profits</span>
                            </li>
                            <li className={` col-2 text-danger m-0 p-0 ${styles.storesListItem}` }>
                              <span>Growth</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <div className={theme === "dark" ? `${styles.distributedStoreListDark}` : `${styles.distributedStoreListLight}`}>
                  <h6 className={`px-4 ${styles.tableHeaders}`}>Stores List</h6>
                  <div className={styles.divisionBreaker}></div>
                  <div className="px-2">
                    {storesList.map((el,index) => (
                      <div className={`d-flex align-items-center ${styles.storeListContentItem}`} key={index}>
                        <div>
                          <img
                            src={el.img}
                            alt="profile"
                            className={styles.logoContainer}
                          />
                        </div>
                        <div className="d-flex flex-column px-2">
                          <span className={styles.storesListSubHeader}>{el.name}</span>
                          <small className={styles.storesListSubText}>{el.mail}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-9">
                <div className={theme === "dark" ? `${styles.distributedStoreListDark}` : `${styles.distributedStoreListLight}`}>
                  <h6 className={`px-1 ${styles.tableHeaders}`}>Top Performing Products</h6>
                  <div className={styles.divisionBreaker}></div>
                  <table className={`${styles.distributedTable}`}>
                    <tr className={`${styles.distributedTr}`}>
                      {dataTableHeaders.map((el, index) => (
                        <th className={`${styles.distributedTh}`} key={index}>{el}</th>
                      ))}
                    </tr>
                    {dataTableContent.map((el, index) => (
                      <tr className={`${styles.distributedTr}`} key={index}>
                        <td className={styles.distributedTd}>{el.h1}</td>
                        <td className={styles.distributedTd}>{el.p1}</td>
                        <td className={styles.distributedTd}>{el.p2}</td>
                        <td className={styles.distributedTd}>{el.p3}</td>
                        <td className={styles.distributedTd}>{el.p4}</td>
                        <td
                          className={`${styles.distributedTd} `}
                          style={{
                            color: el.stock === "In Stock" ? "green" : "red",
                          }}
                        >
                          <div className={styles.dataContentStock}>
                            {el.stock}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
