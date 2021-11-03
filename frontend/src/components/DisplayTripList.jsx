import Note from "./Note.jsx";

function DisplayTripList(props) {

  const tripRecords = props.tripRecords;


  return (
    <div>
    {
      tripRecords.map( (record) => {
            return <Note trip={record} idx={record._id} key={record._id} statusAction={props.statusAction}/>
      })
    }
    </div>
  )
}

export default DisplayTripList;
