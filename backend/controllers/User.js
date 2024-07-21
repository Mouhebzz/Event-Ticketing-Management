require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const User = require("../models/User"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const crypto = require("crypto");

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Signup route to create a new user
router.post("/signup", async (req, res) => {
  const { email } = req.body
  // Check we have an email
  if (!email) {
     return res.status(422).send({ error: "Missing email." });
  }
  try{
     // Check if the email is in use
     const existingUser = await User.findOne({ email }).exec();
     if (existingUser) {
        return res.status(409).send({ 
              error: "Email is already in use."
        });
      }
    
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await User.create(req.body);
    

    return res.status(200).json(user);


  } catch (error) {
    res.status(400).json({ error });
  }
});

//Send Email Verification Token
router.post("/validate-email", async(req,res) => {
  const { email } = req.body;
    // Check we have an email
  if (!email) {
    return res.status(422).send({ error: "Missing email." });
  }
       // check if the user exists
  try{
  const user = await User.findOne({ email: req.body.email });
  if(user){
    const verificationToken = user.generateVerificationToken();
    const url = `https://app.evenhub.online/user/verify/${verificationToken}`;

    const msg = {
      to: email, // Change to your recipient
      from: 'eventhubtrento@outlook.com', // Change to your verified sender
      subject: 'Welcome to EventHub! Verify Your Account',
      html: `Click <a href = '${url}'>here</a> to confirm your email.`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
    return res.status(201).send({
      message: `Sent a verification email to ${email}`
    });
  }
  } catch (error) {
    res.status(400).json({ error });
  }
  });

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body
    // Check we have an email
    if (!email) {
        return res.status(422).send({ 
             error: "Missing email." 
        });
    }
    // check if the user exists
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
              //Ensure the account has been verified
              if(!user.verified){
                return res.status(400).json({ 
                      error: "Verify your Account." 
                });
           }
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const payload={ email: user.email, _id: user._id, name: user.name, surname: user.surname };
        const token = await jwt.sign(payload, process.env.USER_VERIFICATION_TOKEN_SECRET);
        // const expirationDate = new Date();
        // expirationDate.setDate(expirationDate.getDate() + 7);
        console.log(token);
        res.cookie("access-token", "bearer "+token, {domain: ".evenhub.online" ,sameSite: 'none', secure: true }).status(200).json(payload);
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//function to test if we parse the cookies from frontend
// router.get('/cookie', (req, res) => {
//   const token = req.cookies["access-token"];
//   console.log(token);
//   // Do something with the cookie value...
// });

router.get("/verify/:id", async (req,res) => {
  const token  = req.params.id;
    // Check we have an id
    if (!token) {
        return res.status(422).send({ 
             message: "Missing Token" 
        });
    }
    // Step 1 -  Verify the token from the URL
    let payload = null
    try {
        payload = jwt.verify(
           token,
           process.env.USER_VERIFICATION_TOKEN_SECRET
        );
    } catch (err) {
        return res.status(500).send(err);
    }
    try{
        // Step 2 - Find user with matching ID
        const user = await User.findOne({ _id: payload.ID }).exec();
        if (!user) {
           return res.status(404).send({ 
              message: "User does not  exists" 
           });
        }
        // Step 3 - Update user verification status to true
        user.verified = true;
        await user.save();
        return res.status(200).send({
              message: "Account Verified"
        });
     } catch (err) {
        return res.status(500).send(err);
     }

});

router.get("/current-user", async(req,res) =>{
  try{
    if (req.cookies["access-token"]){
      const token = (req.cookies["access-token"]).split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
        if (payload) {
          // store user data in request object
          res.status(200).json(payload);
          //console.log(payload)
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      res.status(400).json({ error: "No authorization header" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
    });

router.post("/reset-password", async(req,res) =>{
  const { email } = req.body;
    // Check we have an email
  if (!email) {
    return res.status(422).send({ message: "Missing email." });
  }
       // check if the user exists
  try{
  const user = await User.findOne({ email: req.body.email });
  if(user){
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = verificationToken;
    user.expireToken = Date.now()+3600000;
    await user.save();
    const url = `http://localhost:3000/new-password?id=${token}`;

    const msg = {
      to: email, // Change to your recipient
      from: 'eventhubtrento@outlook.com', // Change to your verified sender
      subject: '[EventHub] Reset Your Password',
      html: `Click <a href = '${url}'>here</a> to reset your password.`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
    return res.status(201).send({
      message: `Sent a reset password email to ${email}`
    });
  }
  else{
    res.status(404).send({
      message: "User does not exist"
    });
  }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/new-password", async(req,res) =>{
  try{
  const sentToken  = req.body.id;
  // Check we have an id
  if (!sentToken) {
      return res.status(422).send({ 
           message: "Missing Token" 
      });
  }

  const newPassword = req.body.password;

  if (!newPassword) {
    return res.status(422).send({ 
         message: "Missing Password" 
    });
}

let user = await User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
});

if (!user) {
    res.status(400).json({
        errors: [
            {
                message:
                    "Session has expired , please resend another Forget your password email",
            },
        ],
    });
}
      // Step 3 - hash user password
      newPassword = await bcrypt.hash(newPassword, 10);

      // Step 4 - Update user password
      user.password = newPassword;
      user.resetToken = undefined;
      user.expireToken = undefined;
      await user.save();
      return res.status(200).send({
            message: "Password Changed Successfully"
      });
   } catch (err) {
      return res.status(500).send(err);
   }
});

router.get('/logout', function(req, res) {
  // Set the expiration time to a date in the past
  res.cookie('access-token', '', { expires: new Date(0), domain: ".evenhub.online" ,sameSite: 'none', secure: true });
  res.send('Logged out successfully');
});


module.exports = router