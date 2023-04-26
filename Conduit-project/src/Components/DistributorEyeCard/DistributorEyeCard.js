import React from 'react'
import styles from '../DistributorEyeCard/DistributorEyeCard.module.css';
import { useSelector } from "react-redux";

export const DistributorEyeCard = ({img,heading,stats}) => {

  const theme = useSelector(state => state.theme.mode);

  return (
    <div className={`${styles.distributorEyeCard} ${theme === 'dark'? styles.darkDistributorCard: styles.lightDistributorCard}`}>
        <div>
            <img src={img} alt="card-icon"/>
        </div>
        <div>
            <small className={styles.eyeCardhead}>{heading}</small>
            <div className={styles.distributedStats}>{stats}</div>
        </div>
    </div>
  )
}
