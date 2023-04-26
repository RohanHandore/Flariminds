import React from "react";
import styles from "./CustomerStatus.module.css";

const CustomerStatus = () => {
    return (
        <div className="row">
            <div className={`col ${styles.customerStatusPanel}`}>
                <h6 className={styles.title}>Pre-Integration</h6>
            </div>
            <div className={`col ${styles.customerStatusPanel}`}>
                <h6 className={styles.title}>Integration</h6>
            </div>
            <div className={`col ${styles.customerStatusPanelActive}`}>
                <h6 className={styles.title}>Live</h6>
            </div>
        </div>
    );
};

export default CustomerStatus;
