import React from "react";
import moment from 'moment-jalaali';

import { DatePicker } from 'react-persian-datepicker';
import datepickerStyle from "./datepicker.css";

class PersianDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //value: moment()
        }
    }

    render() {
        const { birthday_start, birthday_end, defaultValue, onChangeDatepicker } = this.props;
        const min_date = moment(birthday_start, 'YYYY-M-D').format('YYYY/M/D');
        const max_date = moment(birthday_end, 'YYYY-M-D').format('YYYY/M/D');
        const datePickerValue = defaultValue ? moment(defaultValue, 'YYYY-M-D') : moment();
        const dateJalali = moment('2013-01-01', 'YYYY-M-D').format('M')
        // console.log(dateJalali)
        const styles = {
            calendarContainer: 'calendarContainer',
            dayPickerContainer: 'dayPickerContainer',
            monthsList: 'monthsList',
            daysOfWeek: 'daysOfWeek',
            dayWrapper: 'dayWrapper',
            selected: 'selected',
            next: 'next',
            prev: 'prev',
            title: 'title',
            heading: 'heading'
        }
        return (
            <DatePicker
                mode="monthSelector"
                className="datepickerInput"
                calendarStyles={styles}
                inputFormat="jYYYY/jM/jD"
                defaultValue={datePickerValue}
                min={birthday_start ? min_date : null}
                max={birthday_end ? max_date : null}
                value={this.state.value}
                onChange={value => onChangeDatepicker(value)}

            />
        )

    }
};
export default PersianDatePicker;
