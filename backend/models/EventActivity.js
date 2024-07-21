const mongoose = require('mongoose');

const eventActivitySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    checkedInAttendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  });
  
const EventActivity = mongoose.model('EventActivity', eventActivitySchema);

module.exports = EventActivity;
