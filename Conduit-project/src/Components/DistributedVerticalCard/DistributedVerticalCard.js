import React from 'react'
import declineSvg from '../../Assets/decline.svg'
import inclineSvg from '../../Assets/incline.svg'
import styles from '../DistributedVerticalCard/DistributedVerticalCard.module.css'
import { useSelector } from "react-redux";

export const DistributedVerticalCard = ({src,heading,stats,hike}) => {

  const theme = useSelector(state => state.theme.mode);

  return (
    <div className={ theme === 'dark' ? `${styles.distributedVerticalCardDark}` : `${styles.distributedVerticalCardLight}`}>
        <div className={styles.logoContainer}>
        <img src={src} alt="icon" className={styles.logo} /> 
        </div>
        <div className={styles.verticalCardHeading}>{heading}</div>
        <h4 className={styles.verticalCardStats}>{stats}</h4>
        <div className={styles.distributedVerticalCardBadge}>
            <img src={hike>0? inclineSvg : declineSvg} alt='card'/>
            <span className={hike>0 ? styles.greenReport : styles.redReport }>{hike}% From Last Month</span>
        </div>
    </div>
  )
}
