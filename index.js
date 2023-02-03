const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./db/connect");
const PORT = 5000 || process.env.PORT;


const Creater = require("./models/Creater");
const Member = require("./models/Member");


const corsOptions = {
  // origin: process.env.ALLOWED_CLIENTS.split(',')
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
// console.log(corsOptions.origin);

app.use(cors(corsOptions));




const auth = require("./routes/auth");

app.use(express.json());


//routes
app.use('/api/v1/auth', auth);


















const start = async () => {
    console.log("this time");
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();


