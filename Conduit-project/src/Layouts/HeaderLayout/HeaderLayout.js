import React from 'react';
import { useSelector } from 'react-redux';
import Calender from '../../Components/Calender/Calender';
import Export from '../../Components/Export/Export'
import styles from './HeaderLayout.module.css'

const HeaderLayout = ({ title }) => {
    const theme = useSelector((state) => state.theme.mode);
    return (
        <div className={`${styles.container} ${theme === 'dark' ? styles.darkContainer : ''}`}>
            {/* <div className='align-items-center'> */}
                <div>
                    <div className={styles.title}>{title}</div>
                </div>
                <div style={{marginLeft: 'auto', height: '100%'}}>
                    <div className='row align-items-center' style={{height: '100%'}}>
                        <div style={{margin: '0 5px', height: '100%'}}>
                            <Calender />
                        </div>
                        <div style={{margin: '0 0 0 5px', height: '100%'}}>
                            <Export/>
                        </div></div>
                    </div>
            {/* </div> */}
        </div>
    )
}

export default HeaderLayout