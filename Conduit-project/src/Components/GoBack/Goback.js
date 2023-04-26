import React from "react";
import styles from "./Goback.module.css";
import backArrow from "../../Assets/PreIntegration/goBackArrow.svg";
import { useSelector } from "react-redux";

const Goback = () => {
    const theme = useSelector((state) => state.theme.mode);
    return (
        <div className="d-flex align-items-center">
            <div style={{padding: '0 5px'}}>
                <img src={backArrow} alt="backArrow" />
            </div>
            <div>
                <h6 className={`${theme === "dark" ? styles.goBackTitleDark : styles.goBackTitleLight}`}>
                    Go back
                </h6>
            </div>
        </div>
    );
};

export default Goback;
