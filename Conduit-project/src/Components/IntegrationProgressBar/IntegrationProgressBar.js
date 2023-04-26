import React from "react";
import styles from "./IntegrationProgressBar.module.css";
import { useSelector } from "react-redux";
import tickMark from '../../Assets/Integration/lightTick.png'
import darkTickMark from '../../Assets/Integration/darkTick.png'

const IntegrationProgressBar = ({ name, status }) => {
    const theme = useSelector((state) => state.theme.mode);

    return (
        <div className={theme === "dark"
                    ? `container  ${styles.bodyDark}`
                    : `container  ${styles.bodyLight}`}>
            <div className={`row ${styles.mainContainer}`}>
                <div className={`col-5 ${styles.name}`}>{name}</div>
                <div className={`col-7 ${styles.status}`}>{status}</div>
            </div>

            <div className="row p-1 no-gutters align-items-center ">
                <progress className={`col ${styles.progressBar}`} value={100} />

                <div className={`col-1 ${styles.circle} ${styles.circleDone}`}>
					<img src={tickMark} style={{position: 'absolute', top: '2px', left: '2px'}}/>
				</div>

                <progress className={`col ${styles.progressBar2}`} value={""} />

                <div className={`col-1 ${styles.circle}`}>
					<img src={darkTickMark} style={{position: 'absolute', top: '2px', left: '2px'}}/>
				</div>

                <progress className={`col ${styles.progressBar2}`} value={""} />

                <div className={`col-1 ${styles.circle}`}>
					<img src={darkTickMark} style={{position: 'absolute', top: '2px', left: '2px'}}/>
				</div>
            </div>
        </div>
    );
};

export default IntegrationProgressBar;
