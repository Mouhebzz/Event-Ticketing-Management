require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const SECRET="secret";
// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
  try {
    // check if auth header exists
    if (req.cookies["access-token"]) {
      // parse token from header
      const token = (req.cookies["access-token"]).split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          //console.log(payload)
          next();
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
};

// export custom middleware
module.exports = {
  isLoggedIn,
};