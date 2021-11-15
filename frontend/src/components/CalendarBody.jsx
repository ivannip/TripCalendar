import React, {useState, useEffect, useCallback, useContext} from "react";
import CreateTrip from "./CreateTrip";
import CalendarView from "./CalendarView";
import DayCount from "./DayCount";
//import DisplayTripList from "./DisplayTripList";
import Note from "./Note";
import { UserContext } from "../context/UserContext"
import axios from "axios";



function CalendarBody(props) {

    //const API_PATH = "http://localhost:3001";
    const [inDate, setInDate] = useState(new Date());
    const [tripRecords, setTripRecord] = useState([]);
    const [status, setStatus] = useState(true);
    const [userContext, setUserContext] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState("true");
    const userId = userContext.details.userId;

    function handleStatus() {
      setStatus((previousStatus) => {
        return !previousStatus;
      })
    };

    function changeQueryDate(date) {
      console.log("Call Change Query Date:" + date);
      setInDate(date);
      console.log("Status date:" + inDate);
    }

    // const fetchTripRecord = useCallback( () => {
    //   console.log("start fetch for date:"+inDate);
    //   const criteria = {year:inDate.getFullYear(), month: inDate.getMonth()+1, userId: userId};
    //   console.log(criteria);
    //   const options = {
    //     url: `${process.env.REACT_APP_API_ENDPOINT}api/triprecords/calendar`,
    //     method: 'POST',
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${userContext.token}`
    //     },
    //     data: criteria
    //   };
    //   axios(options).then(result => {
    //     console.log(result.data);
    //     setTripRecord(result.data);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
    //
    // }, [setTripRecord, inDate]);


    useEffect( () => {

      function fetchRecord() {
        console.log("start fetchRecord for date:"+inDate);
        setIsLoading(true);
        const criteria = {year:inDate.getFullYear(), month: inDate.getMonth()+1, userId: userId};
      //   fetch(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/calendar`, {
      //         method: "POST",
      //         credentials: "include",
      //         headers: {
      //           "Content-Type": "application/json",
      //           Authorization: `Bearer ${userContext.token}`,
      //         },
      //         body: JSON.stringify(criteria),
      //   })
      //   .then(result => {
      //     setTripRecord(result.data);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   })
      //
      //   setIsLoading(false);
      // }
        const options = {
          url: `${process.env.REACT_APP_API_ENDPOINT}api/triprecords/calendar`,
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userContext.token}`
          },
          data: criteria
        };
        axios(options)
        .then(result => {
          setTripRecord(result.data);
        })
        .catch(err => {
          console.log(err);
        })

        setIsLoading(false);
      }

      fetchRecord();
    }, [status, inDate])


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
          <CreateTrip statusAction={handleStatus} />
          {isLoading? (
            <div>Loading ... </div>
          ): (
            <CalendarView tripRecords={tripRecords} queryDateAction={changeQueryDate}/>
          )}
        </div>
        <div className="col-6">
          <DayCount />
          {
            isLoading?(
              <div>Loading...</div>
            ):(
              tripRecords.map( (record) => {
                    return <Note trip={record} idx={record._id} key={record._id} statusAction={handleStatus}/>
              })
            )
          }
        </div>
      </div>
    </div>
  )

}

export default CalendarBody;
