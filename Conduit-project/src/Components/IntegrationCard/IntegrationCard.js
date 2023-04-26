import React from "react";
import { useSelector } from "react-redux";
import styles from "./IntegrationCard.module.css";
import tickCircle from "../../Assets/tickCircle.svg";
import uncheckCircle from "../../Assets/Integration/uncheckCircle.png";
import leftArrow from "../../Assets/Integration/leftArrow.png";

const IntegrationCard = ({ textObj }) => {
    const theme = useSelector((state) => state.theme.mode);

    return (
        <div className={`${styles.cardContainer} ${theme === "dark" ? `${styles.dark_cards}` : `${styles.light_cards}`}`}>
			{textObj &&
				textObj.map((item) => {
					return (
						<>
							<div style={{display: 'flex'}}>
								<div className={styles.checkBoxCol}>
									<img src={item.options ? tickCircle : uncheckCircle} className={styles.tickImg} alt="complete-icon"/>
								</div>
								<div style={{padding: '10px'}}>
									<div>{item.title}</div>
									{item.value ?
										<>
											<input value={item.value} readOnly className={styles.inputBox}>
											</input>
											<img src={leftArrow} height={20} style={{padding: '0 10px'}}></img>
										</>
										: <></>}
								</div>
							</div>
						</>
					);
				}
			)}
        </div>
    );
};

export default IntegrationCard;
