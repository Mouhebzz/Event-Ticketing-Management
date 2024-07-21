const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const UserRouter = require("./controllers/User") //import User Routes
const TodoRouter = require("./controllers/Todo") // import Todo Routes
const EventsRouter = require("./controllers/Events"); // import Events Routes
const EventActivityRouter = require("./controllers/EventActivity"); // import EventActivity Routes
const cors = require("cors") // import cors
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;


//Connect mongoDB database
const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database=mongoose.connection;

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () =>{
    console.log('Database connected');
})

//Setting up the server
const app = express();

app.set('trust proxy', true);
app.set('proxy', true);
app.use(cors({credentials: true, origin: 'https://www.evenhub.online'}));
app.all(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.evenhub.online');
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  next();
});
app.use(express.json());
app.use(cookieParser());


app.use("/user", UserRouter) // send all "/user" requests to UserRouter for routing
app.use("/todos", TodoRouter) // send all "/todos" request to TodoROuter
app.use("/events", EventsRouter)
app.use("/eventactivity", EventActivityRouter)

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})

module.exports = app;