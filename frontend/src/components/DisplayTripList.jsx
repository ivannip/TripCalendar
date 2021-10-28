import React, {useState, useEffect} from "react";
import Note from "./Note.jsx";
import axios from "axios";

function DisplayTripList(props) {

  const [tripRecords, setTripRecord] = useState([]);

  useEffect( () => {

    async function getTripRecord() {
      try {
        const {date, userid} = props;
        console.log("start fetch");
        const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}api/triprecords/${date.getMonth()+1}/${date.getFullYear()}/${userid}`,
                                    );
        setTripRecord(res.data);
        console.log("end fetch");
      } catch(error) {
        console.log('error', error);
      }
    }

    getTripRecord();
  }, [props])

  return (
    <div className="col-6">
    {
      tripRecords.map( (record) => {
            return <Note trip={record} idx={record._id} key={record._id}/>
      })
    }
    </div>
  )
}

export default DisplayTripList;
