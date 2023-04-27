require("dotenv").config();
const express = require("express");
//const cookieparser = require("cookie-parser")
const mongoose = require("mongoose");
const app = express();


// adding the middleware
app.use(express.json());
//app.use(cookieparser());
app.use(express.urlencoded({extended:false}));

app.use("/user",require("./routers/userRouter"));
// app.use("/student",require("./routers/studentRoute"));
// app.use("/teacher",require("./routers/teacherRoute"));
// app.use("/roles",require("./routers/roleRoutes"));


//creating the mongoose and express server 
const port =process.env.PORT
mongoose.connect(process.env.MONGO_URI,
  {
   dbName: process.env.DB_NAME,
   useNewUrlParser:true,
   useUnifiedTopology:true,
  }).then(()=>
  {
    console.log("Connected to Mongo....server..");
    app.listen(port,()=>
    {
        console.log("Connected at port->"+port)
    })
  }).catch((error)=>
  {
    console.log(error)
    console.log("Cant connect to the mongo server")
  })
