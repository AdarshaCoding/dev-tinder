const adminAuth = (req, res, next) => {
  let { token } = req.body;
  let isAdminAuthorized = token == "abc";
  if (!isAdminAuthorized) {
    res.status(401).send("User is not authorized.");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  let token = req.body.token;
  let isUserAuthorized = token === "abc";
  if (!isUserAuthorized) {
    res.status(401).send("User is not Authorized!");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
