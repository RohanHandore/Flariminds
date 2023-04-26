import { React, useState} from 'react'
import styles from './SideBar.module.css'
import logo from '../../Assets/conduit_new_logo.png'
import logoSmall from '../../Assets/logo_small.svg'
import newlogo from '../../Assets/Icons/newLogo.svg'
// import CloseArrow from '../CloseArrow/CloseArrow'
import dashboardIcon from "../../Assets/Icons/Category.svg"
import messageIcon from "../../Assets/Icons/Message.svg"
import reportsIcon from "../../Assets/Icons/Paper.svg"
import notificationIcon from "../../Assets/Icons/Notification.svg"
import invoicesIcon from "../../Assets/Icons/Wallet.svg"
import bookmarkIcon from "../../Assets/Icons/Bookmark.svg"
import videoIcon from "../../Assets/Icons/Video.svg"
import settingIcon from "../../Assets/Icons/Setting.svg"
import aboutIcon from "../../Assets/Icons/Info_Square.svg"
import moonIcon from "../../Assets/Icons/Vector.svg"
import arrowLeft from "../../Assets/Icons/arrowLeft.svg"
import arrowRight from "../../Assets/Icons/arrowRight.svg"
import arrowleft_black from "../../Assets/Icons/arrowleft_black.svg"
import sunIcon from "../../Assets/Icons/sunIcon.svg"
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from "../../Redux/Slices/themeSlice";
import sidebar_Dark from "../../Assets/Icons/sidebar_darkMode.svg"
import sidebar_Light from "../../Assets/Icons/sidebar_lightMode.svg"
import logo_lightMode from "../../Assets/Icons/logo_lightMode.svg"
import arrowRightBlack from "../../Assets/Icons/arrowRight_black.svg"

const mainMenu = [
  {
    icon:dashboardIcon,
    title:"Dashboard"
  },
  {
    icon:messageIcon,
    title:"Messages"
  },
  {
    icon:reportsIcon,
    title:"Reports"
  },
  {
    icon:notificationIcon,
    title:"Notifications"
  },
  {
    icon:invoicesIcon,
    title:"Invoices"
  },
]

const works = [
  {
    icon:bookmarkIcon,
    title:"Bookmarks"
  },
  {
    icon:videoIcon,
    title:"Conferences"
  }
]

const options = [
  {
    icon:settingIcon,
    title:"SETTINGS"
  },
  {
    icon:aboutIcon,
    title:"ABOUT"
  }
]

const SideBar = ({sidebar, setSidebar}) => { 
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);
  const screenHeight = window.innerHeight;
  
  return (
    <div className={`${styles.sidebarContainer} ${theme === 'dark' ? styles.darkSidebarContainer : '' } ${!sidebar ? styles.collapsedSidebar : '' }`}>
      	<div>
        	<div className='mt-1 mb-4' >
				<div>
          		{/* <div style={{width: '90%', margin: 'auto', textAlign: 'center', alignItems: 'center' }}> */}
					{sidebar ?
						<div style={{padding: '15px 10px', margin: 'auto'}}>
							<img src={logo} alt="Logo" className={styles.logoImg}/>
							<img src={theme === 'dark' ? arrowLeft : arrowleft_black} onClick={()=>setSidebar(!sidebar)} className={styles.arrow} alt="arrow" />
						</div>
					: <div style={{ padding: '10px 5px'}}>
						<img src={logoSmall} alt="Logo" className={styles.logoImg}/>
						<div style={{marginTop: '15px'}}>
							<img src={theme === 'dark' ? arrowRight : arrowRightBlack} onClick={()=>setSidebar(!sidebar)} className={styles.arrow} alt="arrow" />
						</div>
					</div>}
				</div>
        	</div>
     		<div className={sidebar ? 'container' : ''}>
				{sidebar &&
     			<div className={styles.heading}>MAIN MENU</div>}
				{mainMenu.map((el)=>(
					<div className='d-flex' key={el.icon}>
						{sidebar ? 
							<>
								<img src={el.icon} className={styles.icon}  alt="icon" />
								<div className={theme === 'dark'? styles.dark_title : styles.light_title}>{el.title}</div> 
							</>
						: <>
							<img src={el.icon} className={styles.iconCollapsed} style={{padding:"10px"}} alt="icon" /> 
						</>}
					</div>
				))}
			</div>
			<hr className={styles.line} />
    		<div className={sidebar ? 'container' : ''}>
				{sidebar &&
     			<div className={styles.heading}>WORKS</div>}
				{works.map((el)=>(
      				<div className='d-flex justify-content-evenly align-items-center  '  key={el.icon}>
        				{sidebar ? 
        					<>
        						<img src={el.icon} className={styles.icon} alt="icon"/>
        						<div className={theme === 'dark'? styles.dark_title : styles.light_title}>{el.title}</div> 
        					</>
        				:  <img src={el.icon} className={styles.iconCollapsed} style={{padding:"10px"}} alt="icon"/>
      					}
        			</div>
      			))}
    		</div>
    		<hr className={styles.line} />
    		<div className={sidebar ? 'container' : ''}>
				{sidebar &&
    			<div className={styles.heading}>OPTIONS</div>}
				{options.map((el)=>(
					<div className='d-flex justify-content-evenly align-items-center  '  key={el.icon}>
						{sidebar ? 
							<>
								<img src={el.icon} className={styles.icon} alt="icon"/>
								<div className={theme === 'dark'? styles.dark_title : styles.light_title}>{el.title}</div> 
							</>
						: <img src={el.icon} className={styles.iconCollapsed} style={{padding:"10px"}} alt="icon"/>
						}
					</div>
				))}
			</div>
		</div>
		{screenHeight > 950 && sidebar ?
			<div className='row'>
				<img src={theme === 'dark'? sidebar_Dark : sidebar_Light } className={`col-12 ${styles.ring_img}`} alt="ring" />
			</div>
			: <></>}
		<div>
			<div className='container ps-1'>
				<div className='d-flex justify-content-evenly align-items-center' onClick={() => dispatch(toggleTheme())}>
					<img src={theme === 'dark'? moonIcon : sunIcon} className={styles.icon} alt="icon"/>
					{sidebar &&
					<div className={styles.themeModeText}>{theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}</div>} 
				</div>
			</div>
		</div>
    </div>
  )
}

export default SideBar