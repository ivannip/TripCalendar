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
    const userId = userContext.details.userId;

    function handleStatus() {
      console.log("Call handleStatus");
      setStatus((previousStatus) => {
        return !previousStatus;
      })
    }

    // function changeQueryDate(date) {
    //   console.log("Call Change Query Date:" + date);
    //   setInDate(date);
    // }

    async function handleDateChange(date) {
      console.log("Handle Date Change:"+date);
      setInDate(date);
      //setTripRecord([]);
      try {
        //const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/month/${date}/${userId}/0`);
        const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords`);
        console.log(res.data);
        setTripRecord(res.data);
      } catch (err) {
        console.log(err);
      }


    }

    // const fetchTripRecord = useCallback( () => {
    //   console.log("start fetch for date:"+inDate);
    //   fetch(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/month/${inDate}/${userId}/0`, {
    //         credentials: "include",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${userContext.token}`,
    //         },
    //       }).then( async (res) => {
    //             if (res.ok) {
    //                 const data = await res.json()
    //                 setTripRecord(data);
    //             } else {
    //               if (res.status === 401) {
    //                 window.location.reload()
    //               } else {
    //
    //               }
    //             }
    //           })
    // }, [setTripRecord, inDate, status]);


    useEffect( () => {

      function fetchRecord() {
        console.log("start fetchRecord for date:"+inDate);
        fetch(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/month/${inDate}/${userId}/0`, {
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
              },
        }).then( async (res) => {
                  if (res.ok) {
                      const data = await res.json()
                      setTripRecord(data);
                  } else {
                    if (res.status === 401) {
                      window.location.reload()
                    } else {

                    }
                  }
            })

      }

      console.log("UseEffect:" + inDate);
      fetchRecord();

    }, [status])


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
          <CreateTrip statusAction={handleStatus}/>
          <CalendarView tripRecords={tripRecords} queryDateAction={handleDateChange}/>
        </div>
        <div className="col-6">
          <DayCount />
          {
            tripRecords.map( (record) => {
                  return <Note trip={record} idx={record._id} key={record._id} statusAction={handleStatus}/>
            })
          }
        </div>
      </div>
    </div>
  )

}

// <MyCalendar date={inDate} userid={userContext.details.userId}/>
//<DisplayTripList tripRecords={tripRecords} statusAction={handleStatus} />
export default CalendarBody;
