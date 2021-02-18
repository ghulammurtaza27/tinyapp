const bcrypt = require('bcrypt');

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return false;
};

const generateRandomString = () => {
  let charSet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 6; i++) {
    id += charSet[Math.floor(Math.random() * charSet.length)];
  }
  return id;
}

function passwordMatches(password, database) {
  return bcrypt.compareSync(password, database.password);
}


module.exports = { getUserByEmail, generateRandomString, passwordMatches };