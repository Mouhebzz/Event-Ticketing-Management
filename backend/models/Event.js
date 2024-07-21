const mongoose = require('mongoose');

// User Schema
const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    short_description:{type: String},
    description: {type: String},
    creator: {type:mongoose.Schema.Types.ObjectId, required:true},
    bannerURL:{type: String},
    location: {type:mongoose.Schema.Types.String},
    start_date: {type: Date},
    end_date:{type: Date},
    category: {type: String},
    price: {type: mongoose.Schema.Types.Decimal128},
    program: {type: mongoose.Schema.Types.Mixed},
    attendees:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    checked_in_attendees:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventActivity',
      }],
  
    created_at: { type: Date, default: Date.now },
})

// User model
const Event = mongoose.model("Event", eventSchema)

module.exports = Event