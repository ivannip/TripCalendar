import React, {useState, useContext} from "react";
import axios from "axios";
//import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import {UserContext} from "../context/UserContext";

function DayCount() {

  const [userContext, setUserContext] = useContext(UserContext);
  const userId = userContext.details.userId;
  const [inParm, setInParm] = useState({date: new Date(), interval:180});
  const [msg, setMsg] = useState("");


  function handleChange(event) {
    const {name, value} = event.target
    setInParm({...inParm, [name]:value});
  };

  async function handleCalculation(event) {
    event.preventDefault();
    const options = {
      url: `${process.env.REACT_APP_API_ENDPOINT}api/triprecords/range`,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`
      },
      data: {
        date: inParm.date,
        interval: inParm.interval,
        userId: userId
      }
    };
    //const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/range/${inParm.date}/${userId}/${inParm.interval}`);
    const res = await axios(options)
    setMsg(`As of ${inParm.date}, you have ${res.data.length} days of travel in the past ${inParm.interval} days.`);
  }

  return (
    <div>
      <form className="create-note">
        {msg}
        <input name="date" type="date" placeholder="start date" value={inParm.date} onChange={handleChange}/>
        <input name="interval" type="text" palceholder="Interval" value={inParm.interval} onChange={handleChange}/>

          <Fab size="small" onClick={handleCalculation}><CalculateIcon /></Fab>

      </form>
    </div>
  )
};

export default DayCount;
