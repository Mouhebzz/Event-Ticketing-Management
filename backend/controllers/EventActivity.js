const express = require('express');
const router = express.Router();
const EventActivity = require('../models/EventActivity');
const User = require('../models/User');
const Event= require('../models/Event');
const { isLoggedIn } = require('./middleware');

// POST /register
router.post('/register/:eventId/:activityId', isLoggedIn, async (req, res) => {
  try {
    const { eventId, activityId } = req.params;

    // Find the event activity
    const eventActivity = await EventActivity.findById(activityId);

    if (!eventActivity) {
      return res.status(404).json({ error: 'Event activity not found' });
    }

    // Find the user
    console.log(req.body.userId);
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if(!user.my_events.includes(eventId)){
        return res.status(404).json({ error: 'User not registered for this event, please buy a ticket before registering for the event activities' });
    }
    // Check if the user is already registered for the activity
    if (eventActivity.attendees.includes(user._id)) {
      return res.status(400).json({ error: 'User is already registered for this activity' });
    }

    // Add the user to the attendees list
    eventActivity.attendees.push(user._id);

    // Save the updated event activity
    await eventActivity.save();

    // Add the event activity to the user's attended activities
    user.attendedActivities.push(eventActivity._id);

    // Save the updated user
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/unregister/:eventId/:activityId', isLoggedIn, async (req, res) => {
    try {
      const { eventId, activityId } = req.params;
  
      // Find the event activity
      const eventActivity = await EventActivity.findById(activityId);
  
      if (!eventActivity) {
        return res.status(404).json({ error: 'Event activity not found' });
      }
  
      // Find the user
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the user is registered for the activity
      if (!eventActivity.attendees.includes(user._id)) {
        return res.status(400).json({ error: 'User is not registered for this activity' });
      }
  
      // Remove the user from the attendees list
      eventActivity.attendees = eventActivity.attendees.filter((attendee) => attendee.toString() !== user._id.toString());
  
      // Save the updated event activity
      await eventActivity.save();
  
      // Remove the event activity from the user's attended activities
      user.attendedActivities = user.attendedActivities.filter((activity) => activity.toString() !== eventActivity._id.toString());
  
      // Save the updated user
      await user.save();
  
      res.json({ message: 'User unregistered successfully' });
    } catch (error) {
      console.error('Error unregistering user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// POST /checkin
router.post('/checkin/:eventId/:activityId', isLoggedIn, async (req, res) => {
    try {
      const { eventId, activityId } = req.params;
      const creator = await User.findById(req.user._id);
      const event = await Event.findById(eventId);
      if (creator._id.toString() != event.creator.toString())
      return res.status(400).json("You are not the creator of the event");
  
      // Find the event activity
      const eventActivity = await EventActivity.findById(activityId);
  
      if (!eventActivity) {
        return res.status(404).json({ error: 'Event activity not found' });
      }
  
      // Find the user
      const user = await User.findById(req.body.participantId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the user is already checked-in for the activity
      if (eventActivity.checkedInAttendees.includes(user._id)) {
        return res.status(400).json({ error: 'User is already checked-in for this activity' });
      }
  
      // Check if the user is registered for the activity
      if (!eventActivity.attendees.includes(user._id)) {
        return res.status(400).json({ error: 'User is not registered for this activity' });
      }
  
      // Add the user to the checked-in attendees list
      eventActivity.checkedInAttendees.push(user._id);
  
      // Save the updated event activity
      await eventActivity.save();

      user.checkedInActivities.push(eventActivity._id);

      await user.save();
  
      res.json({ message: 'User checked-in successfully' });
    } catch (error) {
      console.error('Error checking-in user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.post('/:eventId/registered-activities', isLoggedIn, async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const userId = req.query.userId;
  
      // Find the event activities where the user is registered
      const activities = await EventActivity.find({ event: eventId, attendees: userId });
  
      res.status(200).json({ activities });
    } catch (error) {
      console.error('Failed to fetch registered activities:', error);
      res.status(500).json({ message: 'Failed to fetch registered activities' });
    }
  });

module.exports = router;
