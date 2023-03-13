const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());




const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");
const authentication = require("./middleware/auth");

app.use(express.json());


//routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/dashboard', authentication, dashboard);










app.get("/api/v1/auth/test", (req, res) => {
  console.log("called...");
  res.cookie("test", "devarshee", {
    httpOnly: true
  })
  res.send("<h1>hello</h1>")
})













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


