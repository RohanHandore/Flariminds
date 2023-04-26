import { React, useState, useEffect } from "react";
import styles from "./NewCustomerDataTable.module.css";
import { useSelector } from "react-redux";
import avatar from "../../Assets/avatar.svg";
import flag from "../../Assets/Flag.svg";
import Enrolled from "./Enrolled/Enrolled";
import arrow from "../../Assets/arrow_right.svg";
import arrow_new from "../../Assets/arrow_new.svg";
import unFlag from "../../Assets/unflag.svg";

const NewCustomerDataTable = ({ dashboardData }) => {
    const theme = useSelector((state) => state.theme.mode);

    // const tableData = [
    //   {
    //     id: 0,
    //     for: 0,
    //     name: "James Cord",
    //     email: "jamescord@gmail.com",
    //     avatar: avatar,
    //     flag: flag,
    //     status: "Enrolled",
    //     date: "Jan 4, 2023",
    //     progress: 50,
    //     days: "3 Days",
    //   },
    //   {
    //     id: 1,
    //     for: 1,
    //     name: "James",
    //     email: "jamescord@gmail.com",
    //     avatar: avatar,
    //     flag: flag,
    //     status: "Enrolled",
    //     date: "Jan 4, 2023",
    //     progress: 75,
    //     days: "3 Days",
    //   },
    //   {
    //     id: 2,
    //     for: 2,
    //     name: "James alpha Cord",
    //     email: "jamescord@gmail.com",
    //     avatar: avatar,
    //     flag: flag,
    //     status: "Enrolled",
    //     date: "Jan 4, 2023",
    //     progress: 20,
    //     days: "3 Days",
    //   },
    // ];

    const tableData = dashboardData?.customer_reports.data;

    const [selected, setSelected] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(tableData);
    }, [dashboardData]);

    const onChangeHandler = (event, index) => {
        const { name, checked } = event.target;
        console.log(index, checked);
        if (name === "allSelect") {
            let tempUser = users.map((user) => {
                return { ...user, isChecked: checked };
            });
            setUsers(tempUser);
        } else {
            let tempUsers = users;
            let tempUser = tempUsers[index];
            tempUser = {
                ...tempUser,
                isChecked: checked,
            };
            tempUsers.splice(index, 1, tempUser);
            console.log(tempUsers);
            setUsers(tempUsers);
        }

        // if (event.target.value === "selectAll") {
        // 	if (event.target.checked) {
        // 		setSelected(tableData.map((item, index) => index));
        // 	} else {
        // 		setSelected([]);
        // 	}
        // } else {
        // 	if (event.target.checked) {
        // 		setSelected([
        // 			...selected,
        // 			tableData[index],
        // 		]);
        // 	} else {
        // 		setSelected(
        // 			selected.splice(index, 1)
        // 			// selected.filter((obj) => obj.id !== tableData[parseInt(event.target.value)].id)
        // 		);
        // 	}
        // }
    };

    useEffect(() => {
        console.log("users", users);
    }, [users]);

    return (
        <div className={`${styles.container} ${theme == 'dark' ? styles.darkContainer : ''}`}>
            <table className={`${styles.table} ${theme == 'dark' ? styles.darkTable : ''}`}>
                <thead>
                    <tr>
                        <th className={styles.inputHead}>
                            <input
                                type="checkbox"
                                name="allSelect"
                                value={"selectAll"}
                                checked={users.filter((user) => user?.isChecked !== true).length < 1}
                                className={`${styles.inputCheckBox} ${theme == 'dark' ? styles.darkInputCheckBox : ''}`}
                                onChange={onChangeHandler}
                            />
                            <label></label>
                        </th>
                        <th>Customer</th>
                        <th></th>
                        <th>Date Added</th>
                        <th>Status</th>
                        <th>Go-Live</th>
                        <th>Progress</th>
                        <th>Flag Column</th>
                        <th>Kick Off Timer</th>
                        <th> </th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((el, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    value={index}
                                    name={el.store_name}
                                    id={index}
                                    onChange={(e) => onChangeHandler(e, index)}
                                    checked={el?.isChecked || false}
                                    className={`${styles.inputCheckBox} ${theme == 'dark' ? styles.darkInputCheckBox : ''}`}
                                />
                            </td>
                            <td>
                                <img src={avatar} alt="pic" className={styles.profileAvatar}/>
                            </td>
                            <td>
                                <div className="fs-4 fw-bold">{el.store_name}</div>
                                <div className={`fs-6 fw-light ${styles.mail}`}>
                                    {el.store_email}
                                </div>
                            </td>
                            <td>
                                {new Date(el.store_go_live_date).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric"})}
                            </td>
                            <td><Enrolled /></td>
                            <td>
                                {new Date(el.store_go_live_date).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric"})}
                            </td>
                            <td>
                                <progress
                                    value={el.store_progress}
                                    className={styles.progressBar}
                                    min="0"
                                    max="100"
                                ></progress>
                            </td>
                            <td>
                                <img
                                    src={el.store_flag_status ? flag : unFlag}
                                    alt="avatar"
									width={20}
                                />
                            </td>
                            <td>{el.store_kick_off_time}</td>
                            <td>
                                <img
                                    src={theme === "dark" ? arrow_new : arrow}
                                    alt="avatar"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NewCustomerDataTable;
