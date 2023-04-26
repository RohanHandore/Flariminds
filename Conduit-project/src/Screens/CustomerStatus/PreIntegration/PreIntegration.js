import { React, startTransition, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./PreIntegration.module.css";
import SideBar from "../../../Components/SideBar/SideBar";
import Calender from "../../../Components/Calender/Calender";
import Export from "../../../Components/Export/Export";
import PreIntegrationCard from "../../../Components/PreIntegrationCard/PreIntegrationCard";
import Goback from "../../../Components/GoBack/Goback";
import Stepprogressbar from "../../../Components/StepProgressBar/Stepprogressbar";
import HeaderLayout from "../../../Layouts/HeaderLayout/HeaderLayout";
import CustomerStatus from "../../../Components/CustomerStatus/CustomerStatus";
import { getPreIntegrationData } from "../../../Services/Api";
import { testData } from "./dummyData";
import Chat from "../../../Components/Chat/Chat";
import ChatData from "../ChatData";

const PreIntegration = () => {
  const [sidebar, setSidebar] = useState(true);
  const [apiData, setApiData] = useState(testData);
  const [distPreIntData, setDistPreIntData] = useState([]);
  const [conduitPreIntData, setConduitPreIntData] = useState([]);

  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    preIntegrationData();
  }, []);

  const preIntegrationData = async () => {
    try {
      let res = await getPreIntegrationData();
      if (res && res.data) {
        setApiData(res?.data.data);
      } else {
        console.log("No response received");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  useEffect(() => {
    let d = apiData;
    let d1 = [];
    d1.push({
      title: "Informational Meeting",
      options: d.store_informational_meeting,
    });
    d1.push({
      title: "Legal Agreement",
      options: d.store_legal_agreement,
    });
    setDistPreIntData(d1);
    let d2 = [];
    d2.push({
      title: "Scope of Engagement/Pricing",
      options: d.store_pricing,
    });
    d2.push({
      title: "Kick-Off Call",
      options: d.store_kick_off_call,
    });
    setConduitPreIntData(d2);
  }, apiData);

  return (
    <div className={`${theme === "dark" ? styles.bodyDark : styles.bodyLight}`}>
      <div className="row">
        <div className={sidebar ? "col-4 col-md-2" : "col-1 "}>
          <SideBar sidebar={sidebar} setSidebar={setSidebar} />
        </div>

        <div className={sidebar ? "col-8 col-md-10" : "col-11"}>
          <div style={{ padding: "0% 2%" }}>
            <div>
              <HeaderLayout title={"Customer Status"} />
              <div className={`row ${styles.goBackContainer}`}>
                <Goback />
              </div>
              <div className={`row ${styles.bar}`}>
                <div className="col-12">
                  <Stepprogressbar />
                </div>
              </div>
              <div className={`row ${styles.cardBox}`}>
                <div className="col">
                  <div className={`${styles.heading}`}>Distributor</div>
                  <PreIntegrationCard preIntegrateData={distPreIntData} />
                </div>
                <div className="col">
                  <div className={`${styles.heading}`}>Conduit</div>
                  <PreIntegrationCard preIntegrateData={conduitPreIntData} />
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
      </div>
    </div>
  );
};

export default PreIntegration;
