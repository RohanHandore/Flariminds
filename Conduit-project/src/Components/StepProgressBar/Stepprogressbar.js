import React from "react";
import styles from "./Stepprogressbar.module.css";
import logo from '../../Assets/Tick.png';

const Stepprogressbar = () => {
    return (
        <div className={styles.container}>
            <div className={`${styles.progressBarBox}`}>
                <div>
                    <div className={`${styles.circle} ${styles.circleDone}`}>
						<img src={logo} style={{marginTop:'35%',width:'2vw',height:'2vw'}}/>
					</div>
                </div>
                <div className={`${styles.barClassContainer}`}>
                    <progress
                        className={`${styles.barClass}`}
                        value={100}
                        max={100}
                    ></progress>
                </div>
                <div>
                    <div className={`${styles.circle} ${styles.circleActive}`}>
						{/* <img src={logo} style={{marginTop:'35%',width:'2vw',height:'2vw'}}/> */}
					</div>
                </div>
                <div className={`${styles.barClassContainer}`}>
                    <progress className={`${styles.barClass}`} value={0} max={100}></progress>
                </div>
                <div className="">
                    <div className={` ${styles.circle}`}></div>
                </div>
            </div>
            <div className={`row ${styles.progressBarBox}`} style={{padding: '5px 0 0 0'}}>
                <div className={`col`}>
                    <p style={{width: '6vw', float: 'left', margin: 'auto'}}>Pre-Integration</p>
                </div>
                <div className={``}></div>
                <div className="col">
                    <p style={{width: '5.5vw', margin: 'auto'}}>Integration</p>
                </div>
                <div className={``}></div>
                <div className="col"  style={{width: '5.5vw'}}>
                    <p style={{width: '4vw', float: 'right', margin : 'auto'}}>Live</p>
                </div>
            </div>
        </div>
    );
};

export default Stepprogressbar;
