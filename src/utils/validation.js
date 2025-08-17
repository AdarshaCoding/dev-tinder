const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  //console.log(firstName, lastName, emailId, password);
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are mandatory");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Enter the valid E-Mail");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Enter the strong passwrod: 1 lower case, 1 upper case, 1 special character, 1 number"
    );
  }
};

const validateLoginData = (emailId) => {
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid credentials");
  }
};

module.exports = { validateSignUpData, validateLoginData };
