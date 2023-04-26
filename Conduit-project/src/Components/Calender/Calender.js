import React, { useEffect, useState } from "react";
import styles from "./Calender.module.css";
import { useSelector } from "react-redux";
import DateRangePicker from "rsuite/DateRangePicker";
import { CustomProvider } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const Calender = () => {
    const theme = useSelector((state) => state.theme.mode);
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
	const [dateRangePickerSize, setDateRangePickerSize] = useState('md')

	useEffect(() => {
		if (window.innerWidth >= 1024) {
			setDateRangePickerSize('lg')
		} else if (window.innerWidth < 1023) {
			setDateRangePickerSize('xs')
		}
	}, [])

    const handleDateRangeChange = (v) => {
        console.log(v);
        setDateRange(v);
    };

    return (
        <div className={`${styles.container} ${theme === 'dark' ? styles.darkContainer : ''}`}>
			<CustomProvider theme={theme}>
				<DateRangePicker
					size={dateRangePickerSize}
					character=" - "
					value={dateRange}
					onChange={(v) => handleDateRangeChange(v)}
					cleanable={false}
					appearance={"subtle"}
					showOneCalendar
					style={{ width: "100%" }}
				/>
			</CustomProvider>
        </div>
    );
};

export default Calender;
