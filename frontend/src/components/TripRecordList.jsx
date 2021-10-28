import React, {useState, useEffect, useCallback} from "react";
import { useHistory, useLocation } from "react-router-dom";
import CreateTrip from "./CreateTrip.jsx";
import MyCalendar from "./MyCalendar.jsx";
import Home from "./Home.jsx";
import Loader from "./Loader.jsx";
import DisplayTripList from "./DisplayTripList.jsx";
import { UserContext } from "../context/UserContext"
import { Button } from "@blueprintjs/core";


function TripRecordList(props) {

    //const API_PATH = "http://localhost:3001";
    const [userContext, setUserContext] = useState(UserContext);
    const [inDate, setInDate] = useState(new Date());
    let location = useLocation();
    let history = useHistory();

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

    const verifyUser = useCallback((resolve, reject) => {
      console.log("start verify")
      fetch(process.env.REACT_APP_API_ENDPOINT+"users/refreshToken", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }).then(async response => {
        if (response.ok) {
            const data = await response.json()
            setUserContext(oldValues => {
              return { ...oldValues, token: data.token, details: data }
            })
        } else {
          setUserContext(oldValues => {
            return { ...oldValues, token: null }
          })
        }
        // call refreshToken every 5 minutes to renew the authentication token.
        console.log("end verify")
        setTimeout(verifyUser, 5 * 60 * 1000)
      })
    }, [setUserContext])




    async function logoutHandler() {
      try {
                              await fetch(process.env.REACT_APP_API_ENDPOINT+"users/logout", {
                                    credentials: "include",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${userContext.token}`,
                                    },
                                  });
        setUserContext( (oldValues) => {
          return { ...oldValues, details: undefined, token: null }
        });
        window.localStorage.setItem("logout", Date.now())
        history.push("/");
      } catch (err) {
        console.log(err);
      }
    }

    useEffect( () => {
      let inYear = (new Date()).getFullYear();
      let inMonth = (new Date()).getMonth()+1;
      if (typeof location.state !== 'undefined') {
        inYear = location.state.year;
        inMonth = location.state.month;
        setInDate(new Date(inYear, inMonth - 1, 1));
      }
      verifyUser()
    }, [props, location.state, verifyUser])


  return userContext.token? (
    <div>
    <p className="text-left">
    <Button
      text="Logout"
      minimal
      intent="primary"
      onClick={logoutHandler}
    />
    </p>
    <div className="container-fluid">
      <div className="row">
        <div className="col-6">
          <CreateTrip userid={userContext.details.userId}/>
          <MyCalendar date={inDate} userid={userContext.details.userId}/>
        </div>
        <DisplayTripList date={inDate} userid={userContext.details.userId}/>
      </div>
    </div>
    </div>
  ): userContext.token === null? (<Home />) : (
    <Loader />
  )

}

export default TripRecordList;
