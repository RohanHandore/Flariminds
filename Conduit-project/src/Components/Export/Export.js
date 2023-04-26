import { React, useState } from "react";
import styles from "./Export.module.css";
import exportIconLight from "../../Assets/export.svg";
import exportIconDark from "../../Assets/black_export.svg";
import { useSelector } from "react-redux";

const Export = () => {
  const theme = useSelector((state) => state.theme.mode);

  const [data, setData] = useState([
    {
      name: "James Cord",
      email: "jamescord@gmail.com",
      status: "Enrolled",
      date: "Jan 4, 2023",
      progress: 50,
      days: "3 Days",
      id: 1,
      for: 1,
    },
    {
      id: 2,
      for: 2,
      name: "James",
      email: "jamescord@gmail.com",
      status: "Enrolled",
      date: "Jan 4, 2023",
      progress: 75,
      days: "3 Days",
    },
    {
      name: "James Cord",
      email: "jamescord@gmail.com",
      status: "Enrolled",
      date: "Jan 4, 2023",
      progress: 20,
      days: "3 Days",
      id: 3,
      for: 3,
    },
    {
      id: 4,
      for: 4,
      name: "James Cord",
      email: "james@gmail.com",
      status: "Enrolled",
      date: "Jan 4, 2023",
      progress: 50,
      days: "3 Days",
    },
  ]);

  const exportCSV = () => {
    const rows = data.map((d) =>
      [d.id, d.name, d.email, d.date, d.status].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my-data.csv");
    document.body.appendChild(link);
    link.click();
  };

	return (
		<div className={`${styles.exportContainer} ${theme === "dark" ? styles.darkExportBox : ''}`} onClick={exportCSV}>
			<img src={theme === "dark" ? exportIconLight : exportIconDark}
				className={styles.imgEdit} alt="exportIcon" />
				<div className={`${styles.exportText}`}>Export</div>
		</div>
			
	);
};

export default Export;
