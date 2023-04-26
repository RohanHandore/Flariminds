 import React,{useState} from 'react'
 import SideBar from '../../Components/SideBar/SideBar'
 import styles from './RetailPartners.module.css'
 import { useSelector } from "react-redux";
 import HeaderLayout from "../../Layouts/HeaderLayout/HeaderLayout";
 import SummaryCard from "../../Components/TotalUnitSold/SummaryCard";
 import TotalSalesCard from "../../Components/TotalSales/TotalSalesCard";
 import { testData } from '../Dashboard/testData';
 import Calender from '../../Components/Calender/Calender';
 import Export from '../../Components/Export/Export';
 
 export const Retail = () => {
    const [sidebar, setSidebar] = useState(true);
    const theme = useSelector((state) => state.theme.mode);
    const [dashboardData,setDashboardData]=useState(testData);

   return (
    <div className={theme === "dark" ? `container-fluid  ${styles.dark_body}` : `container-fluid  ${styles.light_body}`}>
    <div className="row">
        <div className={sidebar ? "col-3 col-md-2 " : "col-1 "}>
            <SideBar sidebar={sidebar} setSidebar={setSidebar} />
        </div>
        <div className={sidebar ? `col-9 col-md-10` : `col-11 `}>
            <div className="py-3" style={{padding:'0% 2%'}}>
                <div>
                    <HeaderLayout title={'Retail Partners'}/>
                    <div className={`row ${styles.salesContainer}`}>
                        <div className="col-12 col-md-6">
                            <SummaryCard dashboardData={dashboardData} />
                        </div>
                        <div className="col-12 col-md-6">
                            <SummaryCard dashboardData={dashboardData} />
                        </div>
                    </div>
                </div>
                <div className={styles.btnsContainer}>
                    <button className={styles.btns}> Quick Add </button>
                    <div style={{margin: '0 0 0 5px', height: '100%'}}>
                        <Calender />
                    </div>
                    <div style={{margin: '5px 0 0 5px', height: '100%'}}>
                        <Export />
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
   )
 }
 