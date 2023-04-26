import React from 'react'
import styles from './CustomerStatusChart.module.css'

import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useSelector } from "react-redux";
Chart.register(CategoryScale);


const CustomerStatusChart = ({title, value, sign, reportResult, reportStatus, data, options }) => {

  
  const theme = useSelector(state => state.theme.mode);
   
  return (
    <div className={'container'}>
        <div className={theme === 'dark' ? ` row  ${styles.darkCardContainer}` : `row  ${styles.lightCardContainer}`}>
            <div className='col'>

                <div className='row'>
                  <div className={` col ${styles.title}`}>{title}</div>
                </div>

                <div className='row'>
                    <div className={` col-1 ${styles.sign}`}>{sign}</div>
                    <div className={`col ${styles.value}`}>{value}</div>
                </div>

                <div className={`row ${styles.resultRow}`}>
                    <div className={`col-2 ${reportResult > 0 ? styles.resultGreen : styles.resultRed }`}>
                        {reportResult+'%'}
                    </div>
                    <h6 className={`col ${styles.status}`}>{reportStatus}</h6>
                </div>

                <div className={`row ${styles.chartBox}`}>
                  <div className='col p-0'>
                  <Line data={data} options={options} className={styles.chart} />
                  </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default CustomerStatusChart