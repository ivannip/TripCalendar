import React, {useState, useContext} from "react";
import { UserContext } from "../context/UserContext"
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function CreateTrip(props) {
  const [userContext, setUserContext] = useContext(UserContext);

  const userId = userContext.details.userId;
  const [IsShow, setIsShow] = useState(false);
  const [tripRecord, setTripRecord] = useState({userid:userId, title:"", date:new Date(), remark:""});

  console.log("Start CreateTrip");

  function handleChange(event) {
    const {name, value} = event.target;
    setTripRecord({...tripRecord, [name]:value});
  }

  async function handleCreate(event) {
    try {
      event.preventDefault();
      await axios.post(process.env.REACT_APP_API_ENDPOINT+"api/triprecords", tripRecord);
      setTripRecord({userid: userId, title:"", date: new Date(), remark:""});
      props.statusAction();
      //history.push({pathname: "/triprecords", state:{year: inYear, month: inMonth}});
    } catch(error) {
      console.error(error);
    }
  }

  function show() {
    setIsShow(true);
  }

  return (<div>
    <form className="create-note">
      {IsShow && (<input name="title" type="text" placeholder="Title" onChange={handleChange} value={tripRecord.title}/>)}
      {IsShow && (<input name="date" type="date"  onChange={handleChange} value={tripRecord.date}/>)}
      <textarea name="remark" placeholder="Input remark here ...." rows={IsShow?3:1} onChange={handleChange} onClick={show} value={tripRecord.remark}/>
      <Zoom in={IsShow}>
        <Fab size="small" onClick={handleCreate}><AddIcon /></Fab>
      </Zoom>
    </form>
  </div>)
};

export default CreateTrip;
