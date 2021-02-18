const { assert } = require('chai');
const bcrypt = require('bcrypt');

const { getUserByEmail, generateRandomString, passwordMatches  } = require('../helpers.js');



const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput)
  });
});


describe('#generateRandomString', function() {

  it('should generate a string', function() {
    const id = generateRandomString();
    assert.isString(id);
  });

  it('should be 6 characters long', function() {
    const id = generateRandomString();
    assert.lengthOf(id, 6);
  });

});

describe('#passwordMatches', function() {

  it('should return true if entered password matches the one in the database', function() {
    const output = passwordMatches("purple-monkey-dinosaur", testUsers.userRandomID);
    assert.isTrue(output);
  });

  it('should return false if entered password does not match the one in the database', function() {
    const output = passwordMatches("wrong-password", testUsers.user2RandomID);
    assert.isFalse(output);
  });

});