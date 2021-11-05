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
      console.log("Call handleStatus");
      setStatus((previousStatus) => {
        return !previousStatus;
      })
    }

    function handleClick() {
      handleDateChange(inDate);
    }

    function changeQueryDate(date) {
      console.log("Call Change Query Date:" + date);
      setInDate(date);
      console.log("Status date:" + inDate);
      // setStatus((previousStatus) => {
      //   return !previousStatus;
      // })
    }

    async function handleDateChange(date) {

      setInDate(date);
      console.log("Handle Date Change - input date:"+date);
      console.log("Handle Date Change - status date:"+inDate);
      setIsLoading(true);
      fetch(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/month/${date}/${userId}/0`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userContext.token}`,
            },
          }).then( async (res) => {
                if (res.ok) {
                    const data = await res.json()
                    console.log(data);
                    setTripRecord(data);
                } else {
                  if (res.status === 401) {
                    window.location.reload()
                  } else {

                  }
                }
          })
      setIsLoading(false);
      // setIsLoading(true);
      // try {
      //   const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/calendar`, {date: date, userId: userId});
      //   console.log(res.data);
      //   setTripRecord((oldData) => {
      //     return res.data;
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
      // setIsLoading(false);
    }

    // const fetchTripRecord = useCallback( () => {
    //   console.log("start fetch for date:"+inDate);
    //   fetch(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/month/${inDate}/${userId}/0`, {
    //         method: "GET",
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
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/month/${inDate}/${userId}/0`, {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userContext.token}`,
              },
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setTripRecord(data);
        })
        .catch(err => {
          console.log(err);
        })

        setIsLoading(false);
      }

      console.log("UseEffect:" + inDate);
      fetchRecord();

    }, [status, inDate])


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
        {inDate.toDateString()}
        <button name="refresh" value="refresh" onClick={handleStatus}>Handle Status</button><button name="refresh" value="refresh" onClick={handleClick}>Handle Click</button>
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

// <MyCalendar date={inDate} userid={userContext.details.userId}/>
//<DisplayTripList tripRecords={tripRecords} statusAction={handleStatus} />
export default CalendarBody;
