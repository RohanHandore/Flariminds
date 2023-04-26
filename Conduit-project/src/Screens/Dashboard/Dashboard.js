import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import SideBar from "../../Components/SideBar/SideBar";
import SummaryCard from "../../Components/TotalUnitSold/SummaryCard";
import TotalSalesCard from "../../Components/TotalSales/TotalSalesCard";
import CustomerDataTable from "../../Components/CustomerDataTable/CustomerDataTable";
import SalesFunnel from "../../Components/SalesFunnel/SalesFunnel";
import { useSelector } from "react-redux";
import NewCustomerDataTable from "../../Components/CustomerDataTable/NewCustomerDataTable";
import { getDashBoardData } from "../../Services/Api";
import { testData } from "./testData";
import HeaderLayout from "../../Layouts/HeaderLayout/HeaderLayout";

const Dashboard = () => {
    const [sidebar, setSidebar] = useState(true);
    const theme = useSelector((state) => state.theme.mode);
    const [dashboardData, setDashboardData] = useState(testData);

    useEffect(() => {
        // showDashBoardData();
    }, []);

    const showDashBoardData = async () => {
        try {
            const res = await getDashBoardData();
            setDashboardData(res.data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className={theme === "dark" ? `container-fluid  ${styles.dark_body}` : `container-fluid  ${styles.light_body}`}>
            <div className="row">
                <div className={sidebar ? "col-3 col-md-2 " : "col-1 "}>
                    <SideBar sidebar={sidebar} setSidebar={setSidebar} />
                </div>
                <div className={sidebar ? `col-9 col-md-10` : `col-11 `}>
                    <div className="py-3" style={{padding:'0% 2%'}}>
                        <div>
                            <HeaderLayout title={'Retail Partners'} />
                            <div className={`row ${styles.salesContainer}`}>
                                <div className="col-12 col-md-6">
                                    {dashboardData && <TotalSalesCard dashboardData={dashboardData} />}
                                </div>
                                <div className="col-12 col-md-6">
                                    {dashboardData && <SummaryCard dashboardData={dashboardData} />}
                                </div>
                            </div>
                        </div>
                        <div className={styles.funnelContainer}>
                            {dashboardData && <SalesFunnel dashboardData={dashboardData} />}
                        </div>
                        <div className={styles.customerTableContainer}>
                            {dashboardData && <NewCustomerDataTable dashboardData={dashboardData} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
