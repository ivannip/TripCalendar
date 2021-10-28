const mongoose = require("mongoose");

const tripRecordSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: [true, "userid is required"]
  },
  title: {
    type: String,
    required: [true, "title is required"]
  },
  date: {
    type: Date,
    required: [true, "Date is required"]
  },
  remark: String
})

module.exports = mongoose.model("TripRecord", tripRecordSchema);
