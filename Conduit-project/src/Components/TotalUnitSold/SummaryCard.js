import React from "react";
import styles from "./SummaryCard.module.css";
import { useSelector } from "react-redux";

const SummaryCard = ({dashboardData}) => {

  	const theme = useSelector(state => state.theme.mode);


  	return (
      	<div className = {`row ${styles.container} ${theme === 'dark' ? styles.darkContainer : ''}`} >
          	<div>
				<div className= {`${styles.headContainer}`}> 
					<div className={`${styles.heading}`}>Total Units Sold</div>
					<div className={`${styles.dateText}`}>Jan 1, 2023 - Feb 29, 2023</div>
				</div>
				<div className={styles.unitsContainer}>
					<div className=  {`row ${styles.price}`}>
						<div className="col-3 ">
							<div className={styles.value}>{dashboardData?.summary_reports.data.total_revenue}</div>
							<div className={styles.category}>Revenue</div>
						</div>
						<div className="col-3 ">
							<div className={styles.value}>{dashboardData?.summary_reports.data.total_orders}</div>
							<div className={styles.category}>Orders</div>
						</div>
						<div className="col-3 ">
							<div className={styles.value}>{dashboardData?.summary_reports.data.average_order_value}</div>
							<div className={styles.category}>Avg. Order Value</div> 
						</div>
						<div className="col-3 ">
							<div className={styles.value}>{dashboardData?.summary_reports.data.total_customers}</div>
							<div className={styles.category}>Net Cust. Sign Up</div>
						</div>
					</div>
					<div className='row'>
						<div className="col-3">
							<p className={styles.bottamLine}></p>
						</div>
						<div className="col-3">
							<p className={styles.bottamLine}></p>
						</div>
						<div className="col-3">
							<p className={styles.bottamLine}></p>
						</div>
						<div className="col-3">
							<p className={styles.bottamLine}></p>
						</div>
					</div>
				</div>
			</div>
		</div>
  	);
};

export default SummaryCard;
