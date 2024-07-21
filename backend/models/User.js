const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


// User Schema
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    resetToken: {
        type: String,
    },
    expireToken: {
        type: Date,
    },

    my_events:[{type:mongoose.Schema.Types.ObjectId, ref:"Event"}],
    created_events:[{type:mongoose.Schema.Types.ObjectId, ref:"Event"}],
    attendedActivities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'EventActivity',
        },
      ],
    
      checkedInActivities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'EventActivity',
        }
      ],
    created_at:{ type: Date, default: Date.now }
});

UserSchema.methods.generateVerificationToken = function () {
    console.log("test");
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "1h" }
    );
    console.log(verificationToken);
    return verificationToken;
};

// User model
const User = mongoose.model("User", UserSchema)

module.exports = User