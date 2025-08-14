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
  console.log(req.body.token);
  console.log(token);
  try {
    let isUserAuthorized = token === "abc";
    if (!isUserAuthorized) {
      throw new Error("User is not authorized.");
    } else {
      next();
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = { adminAuth, userAuth };
