
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = process.env.PORT || "3001";

const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//Setup Database Connection
const LOCAL_DB = "mongodb://127.0.0.1:27017/trip_calendar";
mongoose.connect(process.env.MONGODB_URL || LOCAL_DB, {useNewUrlParser:true});


//Setup authenticate Strategy
require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

//Setup Authorization route
const userRouter = require("./routes/userRoutes");
app.use(passport.initialize());
app.use("/users", userRouter);

//Setup data API route
const router = require("./routes/dataRoutes.js");
app.use('/api', router);

//Setup for CORS and whitelist from env file
// const whitelist = process.env.WHITELISTED_DOMAINS? process.env.WHITELISTED_DOMAINS.split(","):[];
// console.log(whitelist);
// const corsOptions = {
//   origin: function(origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("not allow by CORS"));
//     }
//   },
//
//   credentials: true
// }
//
// app.use(cors(corsOptions));

mongoose.connection.once('open', function() {
  console.log('Connected to the Database.');
});
mongoose.connection.on('error', function(error) {
  console.log('Mongoose Connection Error : ' + error);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// app.listen(PORT, function() { console.log("Server listening on port "+PORT) });
app.listen(PORT, function() { console.log(`Server listening on port ${PORT}`) });
