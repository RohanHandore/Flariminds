import React from "react";
import styles from "./PreIntegrationCard.module.css";
import { useSelector } from "react-redux";
// import TickSvg from '../../Assets/tickComplete.svg'

const OptionsCard = ({ options }) => {
    return (
        <>
            <div className={`${styles.statusBox}`}>
                <div className={`${styles.statusStyleLine}`}>
                    <div className={`${styles.statusLine} ${styles.topStatusLine} ${options.pending ? styles.statusActive : ""}`}></div>
                </div>
                <div className={`${styles.statusStyleContent}`}>Pending</div>
            </div>
            <div className={`${styles.statusBox}`}>
                <div className={`${styles.statusStyleLine}`}>
                    <div className={`${styles.statusLine} ${options.scheduled ? styles.statusActive : ""}`}></div>
                </div>
                <div className={`${styles.statusStyleContent}`}>Scheduled</div>
            </div>
            <div className={`${styles.statusBox}`}>
                <div className={`${styles.statusStyleLine}`}>
                    <div
                        className={`${styles.statusLine} ${
                            styles.bottomStatusLine
                        } ${options.completed ? styles.statusActive : ""}`}
                    ></div>
                </div>
                <div className={`${styles.statusStyleContent}`}>Completed</div>
            </div>
        </>
    );
};

const pricingOptionsCard = () => {
    return (
        <div className={`row ${styles.statusBox}`}>
            <div className="col-1">
                {/* <div className={` ${index == '0' ? styles.topStatusLine : index == preIntegrateData[0].options.length-1 ? styles.bottamStatusLine : styles.statusLine}`}></div> */}
            </div>
            <div className="col-10" style={{ fontSize: "1.5vw" }}>
                Pending
            </div>
        </div>
    );
};

const PreIntegrationCard = ({ preIntegrateData }) => {
    
    const theme = useSelector((state) => state.theme.mode);

    return (
        <div className={`${styles.cardContainer} ${
            theme === "dark" ? styles.cardDark : styles.cardLight}`}>
            {preIntegrateData && preIntegrateData.length > 0 ? (
                <>
                    <div className={styles.firstBlock}>
                        <div className={`${styles.title}`}>
                            {preIntegrateData[0].title}
                        </div>
                        <OptionsCard options={preIntegrateData[0].options} />
                    </div>
                    <div className={`d-flex align-items-center ${styles.midLine}`}>
                        <div className={styles.vertical_line}></div>
                    </div>
                    <div className={styles.firstBlock}>
                        <div className={`${styles.title}`}>
                            {preIntegrateData[1].title}
                        </div>
                        <OptionsCard options={preIntegrateData[1].options} />
                    </div>
                    </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default PreIntegrationCard;
