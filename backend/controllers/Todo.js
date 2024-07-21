const { Router } = require("express"); // import Router from express
//const Event= require("../models/event");
const User=require("../models/User");
const EventActivity = require('../models/EventActivity');
const { isLoggedIn } = require("./middleware"); // import isLoggedIn custom middleware
const mongoose = require("mongoose");
const Event = require("../models/Event");
const router = Router();


// create Route with isLoggedIn middleware
router.post("/create-event", isLoggedIn, async (req, res) => {
  const body = req.body;
  console.log("hi");
  console.log(req.user);
  const user = await User.findOne({ email: req.user.email })
  try {
    const newEvent = await Event.create({
      name: body.name,
      description: body.description,
      short_description: body.short_description,
      location: body.location,
      start_date: body.start_date,
      end_date: body.end_date,
      price: body.price,
      category: body.category,
      bannerURL: body.bannerURL,
      creator: user._id,
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { created_events: newEvent._id },
    });

    console.log("Event created  ", newEvent);

    res.status(200).json(newEvent);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.post('/created-events', isLoggedIn, async (req, res) => {
  try{
    const user =  await User.findOne({email:req.body.email}).populate("created_events")
    console.log(user)
    res.status(200).json(user.created_events);

}catch(e){
 
    console.log("error while finding user" + e);
    res.status(500).json(e);
  }
});

//Buy Route with LoggedIn middleware
router.post('/buy', isLoggedIn, async(req, res)=>{
  console.log("buying ticket for event ", req.body.eventId);
  const conn = mongoose.connection;
  const session = await conn.startSession();
  try {
    session.startTransaction();

    const event = await Event.findById(req.body.eventId);

    if (event.attendees.includes(req.body.userId)) {
      return res.status(500).json({ error: "You are already registred in this event" });
    }

    await Event.updateOne({_id:event._id}, {
      $push: { attendees: req.body.userId },
    });

    await User.updateOne({_id:req.body.userId}, {
      $push: { my_events: req.body.eventId },
    });

    await session.commitTransaction();
    res.status(200).json({ msg: "Payment Sucessfull" });
    console.log("success");
  } catch (error) {
    console.log("error");
    await session.abortTransaction();
    res.status(500).json({ error: "Payment failed" });
    session.endSession();
  }
});

router.post('/mytickets', isLoggedIn, async(req,res)=>{
  console.log("retrieving events for user ", req.body.email);

  try{
      const user =  await User.findOne({email:req.body.email}).populate("my_events")
      res.status(200).json(user.my_events);
  
  }catch(e){
   
      console.log("error while finding user");
      res.status(500).send("Error retrieving events" + e);
    }
})


router.post('/checkin', isLoggedIn, async(req,res)=>{
  console.log("checkin in for event ", req.body.eventId);

  //check that the request comes from the creator
  //check that the participant is not yet checked in
  //check that the participant is in the attendees list of the event
  //check in successfull
  try {
    const creator = await User.findById(req.body.userId);
    const event = await Event.findById(req.body.eventId);


    const participantId = req.body.participantId;
    if (creator._id.toString() != event.creator.toString())
      return res.status(400).json("You are not the creator of the event");
    if (!event.attendees.includes(participantId))
      return res
        .status(400)
        .json({ error: "The participant is not in the attendees list" });
    if (event.checked_in_attendees.includes(participantId))
      return res
        .status(400)
        .json({ error: "The participant is already checked in" });

    await Event.updateOne(
      { _id: event._id },
      {
        $push: { checked_in_attendees: participantId },
      }
    );

    const user = await User.findOne({ _id: participantId });
    return res.status(200).json({user, message: "Check-in successfull" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Check-in failed" + e });
  }
})




module.exports = router