import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Integration.module.css";
import SideBar from "../../../Components/SideBar/SideBar";
import Calender from "../../../Components/Calender/Calender";
import Export from "../../../Components/Export/Export";
import IntegrationCard from "../../../Components/IntegrationCard/IntegrationCard";
import Stepprogressbar from "../../../Components/StepProgressBar/Stepprogressbar";
import IntegrationProgressBar from "../../../Components/IntegrationProgressBar/IntegrationProgressBar";
import backArrow from "../../../Assets/PreIntegration/goBackArrow.svg";
import { getIntegrationData } from "../../../Services/Api";
import { integrationRawData } from "./IntegrationData";
import Goback from "../../../Components/GoBack/Goback";
import Chat from "../../../Components/Chat/Chat";
import ChatData from "../ChatData";
import HeaderLayout from "../../../Layouts/HeaderLayout/HeaderLayout";

const Integration = () => {
    const [sidebar, setSidebar] = useState(true);
    const theme = useSelector((state) => state.theme.mode);
    const [customerData, setCustomerData] = useState([])
    const [distributorData, setDistributorData] = useState([]);
    const [conduitData, setConduitData] = useState([]);

    useEffect(() => {
        integrationDataFn();
    }, []);

    const integrationDataFn = async () => {
        try {
            let res = await getIntegrationData();
            let apiData = res.data.data;

            let custData = []
            custData.push({
                title: "Partner access to store",
                options: apiData.customer.partner_access_to_store
            })
            custData.push({
                title: "Alliance Account Number Generated",
                options: apiData.customer.alliance_account_number.is_made,
                value: apiData.customer.alliance_account_number.account_number
            })
            setCustomerData(custData)

            let distData = [];
            distData.push({
                title: "Customer fulfillment location created",
                options: apiData.distributor.custom_fulfillment_location_created
            });
            distData.push({
                title: "Customer License assigned",
                options: apiData.distributor.custom_license_assigned
            });
            distData.push({
                title: "Product upload validation",
                options: apiData.distributor.product_upload_validation
            });
            distData.push({
                title: "Schedule go-live",
                options: apiData.distributor.scheduled_go_live
            });
            setDistributorData(distData);

            let condData = [];
            condData.push({
                title: "Custom App Created and Installed",
                options: apiData.conduit.custom_app_created_and_installed
            });
            condData.push({
                title: "Initial Product Upload",
                options: apiData.conduit.initial_product_upload
            });
            condData.push({
                title: "End-to-End Testing",
                options: apiData.conduit.end_to_end_testing
            });
            setConduitData(condData);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <div className={`container-fluid ${styles.integrationContainer}
                ${theme === "dark" ? styles.darkContainer : styles.lightContainer}`}>
            <div className="row">
                <div className={sidebar ? "col-2 " : "col-1"}>
                    <SideBar sidebar={sidebar} setSidebar={setSidebar} />
                </div>
                <div className={sidebar ? "col-10 " : "col-11"}>
                   
                   <HeaderLayout title={'Customer Status'} />

                    <div className="row">
                        <div className="col-10 col-md-4 col-lg-3">
                            <Goback />
                        </div>
                    </div>

                    <div className={`row `}>
                        <div className={`col ${styles.stepbarContainer}`}>
                            <Stepprogressbar />
                        </div>
                    </div>

                    <div className="row" >
                        <div className="col-4">
                            <IntegrationProgressBar
                                name="Customer"
                                status={"2 of 3 tasks remaining"}
                            />
                        </div>
                        <div className="col-4">
                            <IntegrationProgressBar
                                name="Distributor"
                                status={"2 of 3 tasks remaining"}
                            />
                        </div>
                        <div className="col-4">
                            <IntegrationProgressBar
                                name="Conduit"
                                status={"2 of 3 tasks remaining"}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <IntegrationCard textObj={customerData}/>
                        </div>
                        <div className="col-4">
                            <IntegrationCard textObj={distributorData} />
                        </div>
                        <div className="col-4">
                            <IntegrationCard textObj={conduitData} />
                        </div>
                    </div>

                    <div className={`row ${styles.chatContentBox}`} >
                            <div className="col">
                                <Chat ChatData={ChatData} />
                            </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Integration;
