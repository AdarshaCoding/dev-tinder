const adminAuth = (req, res, next) => {
  let { token } = req.body;
  let isAdminAuthorized = token == "abc";
  if (!isAdminAuthorized) {
    res.status(401).send("User is not authorized.");
  } else {
    next();
  }
};

module.exports = { adminAuth };
