const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const Session = new Schema({
  refreshToken: {
    type: String,
    default: ""
  }
});

//array of session token could support sign in from multiple devices at the same time
const User = new Schema({
  authStrategy: {
  type: String,
  default: "local"
  },
  point: {
    type: Number,
    default: 50
  },
  refreshToken: {
    type: [Session]
  }
});

//Remove Token from response
User.set("toJSON", {
  transform: function(doc, ret, options) {
    delete ret.refreshToken;
    return ret;
  }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
