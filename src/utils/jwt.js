const jwt = require("jwt-simple");
const moment = require("moment");

exports.createToken = function (user) {
  const payload = {
    sub: user._id,
    nombres: user.nombres,
    apellidos: user.apellidos,
    email: user.email,
    role: "admin",
    iat: moment().unix(),
    exp: moment().add(60, "days").unix(),
  };
  return jwt.encode(
    payload,
    "go&dpLUeG@$YCZ2jFXAg*%hv@LttoqW4CboHr7^TrhysW2r^A",
    "HS256"
  );
};

exports.verifyToken = function (token) {
  return jwt.decode(
    token,
    "go&dpLUeG@$YCZ2jFXAg*%hv@LttoqW4CboHr7^TrhysW2r^A",
    "HS256"
  );
};
