import {useState, useEffect, useCallback} from 'react';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import PickersDay from '@mui/lab/PickersDay';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import CalendarPickerSkeleton from '@mui/lab/CalendarPickerSkeleton';



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




function CalendarView(props) {
  //const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [value, setValue] = useState(new Date());

  console.log("start CalendarView");

  const fetchHighlightedDays = useCallback( () => {
    const daysToHighlight = (props.tripRecords).map((record) => {
          return record.day;
    })
    setHighlightedDays([1, ...daysToHighlight]);
    setIsLoading(false);

  }, [props.tripRecords])


  useEffect(() => {
      fetchHighlightedDays();
  }, [fetchHighlightedDays]);

  function handleMonthChange(date) {
    setIsLoading(true);
    setHighlightedDays([]);
    props.queryDateAction(date);
    //history.push({pathname: "/triprecords", state: {year:date.getFullYear(), month:date.getMonth()+1}});
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




export default CalendarView;
