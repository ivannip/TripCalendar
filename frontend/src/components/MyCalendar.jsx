import {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import PickersDay from '@mui/lab/PickersDay';
//import DatePicker from '@mui/lab/DatePicker';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import CalendarPickerSkeleton from '@mui/lab/CalendarPickerSkeleton';
//import getDaysInMonth from 'date-fns/getDaysInMonth';
import axios from "axios";

// function getRandomNumber(min, max) {
//   return Math.round(Math.random() * (max - min) + min);
// }

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
// function fakeFetch(date, { signal }) {
//   return new Promise((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       const daysInMonth = getDaysInMonth(date);
//       const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));
//
//       resolve({ daysToHighlight });
//     }, 500);
//
//     signal.onabort = () => {
//       clearTimeout(timeout);
//       reject(new DOMException('aborted', 'AbortError'));
//     };
//   });
// }




function MyCalendar(props) {
  //const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [value, setValue] = useState(props.date);
  const userid = props.userid;
  let history = useHistory();

  async function fetchTripRecord(date) {
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    //const daysInMonth = getDaysInMonth(date);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/${month}/${year}/${userid}`);
      //console.log(response.data);
      //const daysToHighlight = [];

      const daysToHighlight = (response.data).map((record) => {
            return record.day;
      })
      setHighlightedDays([1, ...daysToHighlight]);

    } catch (err) {
      console.log('error', err);
    }

  }

  function fetchHighlightedDays(date) {
    //console.log("Variable date: " + date);
    //const daysToHighlight = fetchTripRecord(date);
    fetchTripRecord(date)
    setIsLoading(false);
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      fetchHighlightedDays(props.date);
      setValue(props.date);
    }
    return () => { isMount = false; }
  }, [props,]);

  function handleMonthChange(date) {
    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
    history.push({pathname: "/triprecords", state: {year:date.getFullYear(), month:date.getMonth()+1}});
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        value={value}
        orientation="landscape"
        loading={isLoading}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        onMonthChange={handleMonthChange}
        onYearChange={handleMonthChange}
        renderInput={(params) => <TextField {...params} />}
        renderLoading={() => <CalendarPickerSkeleton />}
        renderDay={(day, _value, DayComponentProps) => {
          const isSelected =
            !DayComponentProps.outsideCurrentMonth &&
            highlightedDays.indexOf(day.getDate()) > 0;

          return (
            <Badge
              key={day.toString()}
              overlap="circular"
              badgeContent={isSelected ? '🌚' : undefined}
            >
              <PickersDay {...DayComponentProps} />
            </Badge>
          );
        }}
      />
    </LocalizationProvider>
  );
}




export default MyCalendar;
