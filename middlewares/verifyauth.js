const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const ErrorHander = require("./errorhandler.js");

function verifyToken(req, res, next) {
  let token = req.header("Authentication");
  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

 jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err.message });
    }
    req._id = decoded.id;
    req.otp = decoded.otp;
    next();
  });
};

async function isadmin(req, res, next) {
  const id = req._id;
  const user = await User.findById(id);
  if (user === null) {
    return next(new ErrorHander('Login to continue', 405));
  }
  if (user.role !== 'admin') {
    return next(new ErrorHander('Unauthorized', 401));
  }
  next()
};

module.exports = { isadmin, verifyToken }