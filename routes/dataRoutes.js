const express = require ("express");
const router = express.Router();
const TripRecord = require("../models/tripRecord");
const { verifyUser } = require("../authenticate");

//create
router.post("/triprecords", (req, res) => {
  const {userid, title, date, remark} = req.body;
  const newTrip = new TripRecord({
    userid: userid,
    title: title,
    date: date,
    remark: remark
  });
  newTrip.save((err) => {
    !err?res.json("create success"):res.send(err);
  })
})


//Update
router.patch("/triprecords/:id", (req, res) => {
  TripRecord.findOneAndUpdate({_id: req.params.id},
    {$set: req.body},
    (err) => {
      !err?res.json("patch success"):res.send(err);
    }
  )
})

//Read all
router.get("/triprecords", (req, res) => {
  TripRecord.find({}, (err, foundRecords) => {
    res.json(foundRecords);
  })
});

//Read One
router.get("/triprecords/:id", (req, res) => {

    TripRecord.findById(req.params.id, (err, foundTrip) => {
      if (err) {
        res.send(err);
      } else {res.json(foundTrip?foundTrip:"No record find!")};
    })

});



//Read by type, date and UserId
router.get("/triprecords/:type/:date/:userId/:interval", (req, res) => {
  const {type, date, userId, interval} = req.params;

  let filter = {};
  if (type === "range") {
    //search by date range
    filter = {userid: userId, date: {$gte: new Date(new Date(date).setDate(new Date(date).getDate()-interval)), $lte: new Date(date)}};
  } else {
    // search by specific $month
    filter = {year: new Date(date).getFullYear(), month: new Date(date).getMonth()+1, userid: userId};
  }

  TripRecord.aggregate([{$project:
    { userid: "$userid",
      title: "$title",
      date: "$date",
      remark: "$remark",
      year: {$year: "$date"},
      month: {$month: "$date"},
      day: {$dayOfMonth: "$date"}}
    }, { $match: filter }],
    (err, foundTrips) => {
    if (err) {
      res.send(err);
    } else {
      res.json(foundTrips.length===0?[]:foundTrips);
    }
  })
})


//Delete One
router.delete("/triprecords/:id", (req, res) => {
  TripRecord.findByIdAndDelete(req.params.id)
  .then( () => {res.json("Record deleted!")})
  .catch( (err) => {res.json("Delete failure!")})
});





module.exports = router;
