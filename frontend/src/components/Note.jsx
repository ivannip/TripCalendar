import React, {useState} from "react";
import {useHistory} from "react-router-dom"
import axios from "axios";

//import DeleteIcon from '@material-ui/icons/Delete';
import DeleteIcon from '@mui/icons-material/Delete';

function Note(props) {
  //console.log(props);
  const [lineThrough, setLineThrough] = useState(false);
  const displayDate = new Date(props.trip.date);
  let history = useHistory();

  function handleClick() {
    setLineThrough(!lineThrough);
  }

  async function handleDelete() {
    try {
      await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/${props.idx}`);
      history.push({pathname:"/triprecords", state: {year: displayDate.getFullYear(), month: displayDate.getMonth()+1}});
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <div className="note" style={{textDecoration: lineThrough?"line-through":""}}>
      <h1 onClick={handleClick}>{props.trip.title} {displayDate.getDate()+"-"+(parseInt(displayDate.getMonth())+1).toString()+"-"+displayDate.getFullYear()}</h1>
      <p onClick={handleClick}>{props.trip.remark}</p>
      <button onClick={handleDelete}><DeleteIcon /></button>
    </div>
  );
};



export default Note;
