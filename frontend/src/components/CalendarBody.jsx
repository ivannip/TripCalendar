import React, {useState, useEffect, useCallback, useContext} from "react";
import CreateTrip from "./CreateTrip";
import CalendarView from "./CalendarView";
import DayCount from "./DayCount";
//import DisplayTripList from "./DisplayTripList";
import Note from "./Note";
import { UserContext } from "../context/UserContext"



function CalendarBody(props) {

    //const API_PATH = "http://localhost:3001";
    const [inDate, setInDate] = useState(new Date());
    const [tripRecords, setTripRecord] = useState([]);
    const [status, setStatus] = useState(true);
    const [userContext, setUserContext] = useContext(UserContext);
    const userId = userContext.details.userId;
  //  const history = useHistory();

  //   const fetchUserDetails = useCallback(() => {
  //     fetch("/users/whoami", {
  //       method: "GET",
  //       credentials: "include",
  //     // Pass authentication token as bearer token in header
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userContext.token}`,
  //       },
  //     }).then(async response => {
  //       if (response.ok) {
  //         const data = await response.json()
  //         setUserContext(oldValues => {
  //           return { ...oldValues, details: data }
  //         })
  //       } else {
  //         if (response.status === 401) {
  //         // Edge case: when the token has expired.
  //         // This could happen if the refreshToken calls have failed due to network error or
  //         // User has had the tab open from previous day and tries to click on the Fetch button
  //           window.location.reload()
  //         } else {
  //           setUserContext(oldValues => {
  //             return { ...oldValues, details: null }
  //           })
  //         }
  //       }
  //     })
  // }, [setUserContext, userContext.token])

    function handleStatus() {
      setStatus((previousStatus) => {
        return !previousStatus;
      })
    }

    function changeQueryDate(date) {
      setInDate(date);
    }

    const fetchTripRecord = useCallback( () => {

      console.log("start fetch for date:"+inDate);

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
                    console.log(`After fetch:`);
                    console.log(tripRecords);
                } else {
                  if (res.status === 401) {
                    window.location.reload()
                  } else {

                  }
                }
              })
    }, [setTripRecord, inDate, userId, userContext.token]);


    useEffect( () => {

      fetchTripRecord()

    }, [status, fetchTripRecord])


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
          <CreateTrip statusAction={handleStatus}/>
          <CalendarView tripRecords={tripRecords} queryDateAction={changeQueryDate}/>
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
