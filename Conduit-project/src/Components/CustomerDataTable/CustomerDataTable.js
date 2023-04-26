import {React, useState, useEffect } from "react";
import styles from "./CustomerDataTable.module.css";
import avatar from "../../Assets/avatar.svg";
import flag from "../../Assets/Flag.svg";
import arrow from "../../Assets/arrow_right.svg";
import arrow_new from "../../Assets/arrow_new.svg"
import Enrolled from "./Enrolled/Enrolled";
import { useSelector } from "react-redux";

const CustomerDataTable = () => {

  const theme = useSelector(state => state.theme.mode);

  const tableData = [
    {
      name: "James Cord",
      email: "jamescord@gmail.com",
      avatar: avatar,
      flag: flag,
      
      status: "Enrolled",
      date: "Jan 4, 2023",
      progress: 50,
      days: "3 Days",
      id:0,
      for:0,
    },
    {
      id:1,
      for:1,
      name: "James",
      email: "jamescord@gmail.com",
      avatar: avatar,
      flag: flag,
      
      status: "Enrolled",
      date: "Jan 4, 2023",
      progress: 75,
      days: "3 Days",
    },
    {
      name: "James alpha Cord",
      email: "jamescord@gmail.com",
      avatar: avatar,
      flag: flag,
      
      status: "Enrolled",
      date: "Jan 4, 2023",
      progress: 20,
      days: "3 Days",
      id:2,
      for:2,
    },
    
  ];


  

    
 

  const [checkedItems, setCheckedItems] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);

  const handleChange = (event) => {
    const {checked,id } = event.target;
    let c = checkedItems
    if (checked) {
      c.push(tableData[parseInt(id)])
      setCheckedItems(c);
    } else {
      c.filter((item) => item.id != parseInt(id))
      setCheckedItems(c);
    }
  };

  useEffect(() => {
    if (checkedItems.length == tableData.length) {
      setIsCheckAll(true)
    } else {
      setIsCheckAll(false)
    }
    // setIsCheckAll(checkedItems.length == tableData.length)
  }, [checkedItems])

  useEffect(() => {
    console.log("here", isCheckAll)
    let elem = document.getElementById('selectAll')
    elem.checked = isCheckAll
  }, [isCheckAll])

  // SelectAll
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    console.log("isCheck", isCheckAll)
    setCheckedItems([])
    if (isCheckAll) {
      setIsCheckAll(false)
      tableData.forEach(t => {
        let elem = document.getElementById(t.id)
        elem.checked = false
      })
    } else {
      // let elem = document.getElementById(-1)
      // elem.checked = true
      setCheckedItems(tableData);
      tableData.forEach(t => {
        let elem = document.getElementById(t.id)
        elem.checked = true
      })
    }
  };

  

  return (
    <>
      <table className={` table  w-100 p-2 ${theme === 'dark' ? styles.dark_tableContent : styles.light_tableContent}`}>
        {/* <thead> */}
          <tr>
            <th>
                {/* <input type="checkbox" className={ theme === 'dark' ?   styles.checkbox : styles.checkbox_light}
                name="selectAll"
                id="selectAll"
                handleClick={handleSelectAll}
                isChecked={isCheckAll}    />
                <label for="checkbox"></label> */}

<input type="checkbox" className={ theme === 'dark' ?   styles.checkbox : styles.checkbox_light}  id={"selectAll"} 
                onChange={handleSelectAll}  />
                <label for={"selectAll"}></label>
            </th>
            <th></th>
            <th>Customer</th>
            <th>Status</th>
            <th>Go-Live Date</th>
            <th>Progress</th>
            <th>Flag Column</th>
            <th>Kick-Off Timer</th>
          </tr>
        {/* </thead> */}
 
        {tableData.map((el) => (
          // <tbody >
            <tr className={styles.tableData} key={el.progress}>
              <td>
                <input type="checkbox" className={ theme === 'dark' ?   styles.checkbox : styles.checkbox_light}  id={el.id} 
                 onChange={handleChange}  />
                <label for={el.for}></label>
              </td>
              <td>
                <img src={avatar} alt="avatar" />
              </td>
              <td>
                <div className="fs-4 fw-bold">{el.name}</div>
                <div className={`fs-6 fw-light ${styles.mail}`}>{el.email}</div>
              </td>
              <td>
                <Enrolled />
              </td>
              <td>{el.date}</td>
              <td>
              <progress value={el.progress} min="0" max="100"></progress>
                </td>
              <td>
                <img src={el.flag} alt="avatar" />
              </td>
              <td>{el.days}</td>
              <td>
                <img src={theme === 'dark' ? arrow_new : arrow } alt="avatar" />
              </td>
            </tr>
          // </tbody>
        ))}
      </table>
    </>
  );
};

export default CustomerDataTable;
