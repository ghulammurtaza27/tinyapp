const bcrypt = require('bcrypt');

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
       return true;
    }
  }
  return false;
};

function generateRandomString() {
  let r = Math.random().toString(36).substring(7);
  return r;
}

function passwordMatches(password, database) {
  return bcrypt.compareSync(password, database.password);
}

module.exports = { getUserByEmail, generateRandomString, passwordMatches };