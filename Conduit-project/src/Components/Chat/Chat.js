import React from 'react'
import styles from "./Chat.module.css"
import EmojiIcon from "../../Assets/Chat/emojiIcon.svg"
import FileIcon from "../../Assets/Chat/fileIcon.svg"
import SendIcon from "../../Assets/Chat/sendIcon.svg"
import { useSelector } from "react-redux";

const Chat = ({ChatData}) => {
    
    const theme = useSelector((state) => state.theme.mode);

  return (
    <div className={`container-fluid p-0 ${theme === "dark" ? styles.containerDark : styles.containerLight}`}>
        <div className='row '>
            <h5 className={`col  ${styles.comment}`}>Comments</h5>
        </div>

        <div className={theme === "dark" ? styles.chatContainerDark : styles.chatContainerLight}>
            <div className={`row ${styles.todayContainer}`}>
                <div className={`col-5 ${styles.dayLine}`}></div>
                <div className={`col-1 ${styles.today}`}>Today</div>
                <div className={`col-5 ${styles.dayLine}`}></div>
            </div>

        {ChatData.map((item, index)=>(
            <div key={index}>
            {item.from==="self" ? 
            <>
                  <div className={styles.userMessageContainer}>
                    <div>
                     <span className={styles.userMessage}>{item.message}</span>
                     <div>
                        <span className={styles.userTime}>{item.time}</span>
                     </div>
                    </div>
                    <div>
                     <img src={item.image} className={styles.avatar} alt='Avatar' />
                    </div>
                  </div>
                </>
                 :
                <>
                    <div className={styles.clientMessageContainer}>
                    <div>
                     <img src={item.image} className={styles.avatar} alt='Avatar' />
                    </div>
                    <div className={styles.clientMessage}>
                        <div >
                            <span className={styles.clientName}>{item.from}</span>
                            <span className={styles.orgName}>{item.organization}</span>
                        </div>
                        <div>{item.message}</div>
                    </div>
                    </div>
                        <span className={styles.clientTime}>{item.time}</span>
                     
                </>
            }
            </div>
        ))}


        <div className={`row ${styles.chatMenuContainer}`}>
            <div className='col'>
                <img src={EmojiIcon} className={` ${styles.icon}`} alt="emojiIcon"></img>
            </div>
            <div className='col'>
                <img src={FileIcon} className={`${styles.icon}`} alt="FileIcon"></img>
            </div>
            <div className='col-8 col-xl-10  col-xxl-11'>
                <input placeholder='Type a message' className={styles.inputBox}></input>
            </div>
            <div className='col'>
                <img src={SendIcon} className={`${styles.icon}`} alt="SendIcon"></img>
            </div>
        </div>

         </div>
      </div>
  )
}

export default Chat