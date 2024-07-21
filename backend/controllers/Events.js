const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require("mongoose");
const EventActivity = require('../models/EventActivity');
const { isLoggedIn } = require("./middleware");

//fetch all events
router.get('/', async (req, res) => {
    try {
      const events = await Event.find();
      res.json({events, message:'Events retrieved successfully'});
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  router.get('/:eventId', async (req, res) => {
    console.log("Retrieving an event with id ", req.params.eventId);
  
    const event = await Event.findById(req.params.eventId).populate("attendees").populate("checked_in_attendees");
    console.log(event);
    res.status(200).send({event, message:'Event retrieved successfully'});
  });



  // Add event activities for an event
router.post('/:eventId/create-activity', isLoggedIn, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, description, time, location } = req.body;
    const user = await User.findOne({ email: req.user.email });
    const event = await Event.findById(eventId);

    // Create a new event activity
    const activity = await EventActivity.create({
      name: name,
      description: description,
      time: time,
      location: location,
      creator: user._id,
      event: event._id,
    });


    // Add the activity to the event's activities array
    event.activities.push(activity._id);

    // Save the updated event
    await event.save();

    res.status(201).json({ activity, event, message: 'Activity created successfully'});
  } catch (error) {
    res.status(500).json(error);
  }
});

// Assuming you have an Express router defined and imported as `router`



// Get event activities for a specific event
router.post('/:eventId/activities', isLoggedIn, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find the event by its ID and populate the activities field
    const event = await Event.findById(eventId).populate('activities');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ activities: event.activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event activities' });
  }
});


  module.exports = router;