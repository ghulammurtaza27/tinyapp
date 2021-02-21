const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');
const { getUserByEmail, generateRandomString, passwordMatches } = require('./helpers');

const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['Key1'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};

const users = { 
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

app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  // redirects to URLs page if logged in otherwise to the login page
  if (req.session.user_id) {
    return res.redirect('/urls');
  }
  return res.redirect('/login');
});


app.get("/urls", (req, res) => {
  //renders URLs page
  const user = users[req.session.user_id];
  const templateVars = { urls: urlDatabase, user, userIDForm: req.session.user_id, };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  //renders create new url page
  const user = users[req.session.user_id];
  const templateVars = { user };
  if (!user){
    return res.redirect("/urls");
  }
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  // allows you to post if logged in otherwise sends an error message
  if (!req.session) {
    return res.status(405).send("You cannot generate URLs if you're not logged in.")
  }
  const shortURL = generateRandomString();
 
  const userId = req.session.user_id;
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = userId;
  res.redirect(`/urls/${shortURL}`);        // Respond with 'Ok' (we will replace this)
});

app.post("/login", (req, res) => {
  // logs in a a user and redirects to url page if information is valid  otherise sends an error message
  const { email, password } = req.body;
  
  for (let user in users) {
    if (getUserByEmail(email, users)) {
      if (passwordMatches(password, users[user])) {
        req.session.user_id = user;
        return res.redirect('/urls');
      }
    }
  }
  return res.status(403).send("Log In info is invalid.");
});

app.get("/login", (req, res) => {
  // renders login page
  const user = users[req.session.user_id];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
  res.render("login", templateVars);
  
});

app.post("/logout", (req, res) => {
  // logs out a user and redirects to main urls page
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  // renders the registration page
  const user = users[req.session.user_id];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
  res.render("register", templateVars);
  
});

// If the e-mail or password are empty strings, send back a response with the 400 status code.
// // If someone tries to register with an email that is already in the users object, send back a response with the 400 status code. Checking for an email in the users object is something we'll need to do in other routes as well. Consider creating an email lookup helper function to keep your code DRY

app.post("/register", (req, res) =>  {
  // registers a user if information is valid and redirects to urls page
  // otherwise renders relevant error messages
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  if (email === "") {
    return res.status(400).send("Email cannot be empty");
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send("This email already exists");
  }
  const userId = generateRandomString();
  const userObj = {
    userId,
    email,
    password: hash, 
  }
  users[userId] = userObj;
  req.session.user_id = userId;
  res.redirect("/urls");
});


app.post('/urls/:shortURL', (req, res) => {
  // allows a user to edit the URL and redirects to main urls page if the user is valid
  if (users[req.session.user_id]) {
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = req.body.longURL;
    return res.redirect(`/urls`);
  } else {
    res.status(405).send("Permission denied.");
  }
  
});
app.post('/urls/:shortURL/delete', (req, res) => {
  //allows the user to delete their own url, otherwise denies permission
  const urlDeleted = req.params.shortURL;
  if(req.session.user_id === urlDatabase[urlDeleted].userID){
    delete urlDatabase[urlDeleted];
    return res.redirect("/urls");
  }
  return res.send("Don\'t you dare");
});
app.get("/urls/:shortURL", (req, res) => {
  //renders a specific shortURL page if user is logged in and owns the url otherwise renders relevant error messages
  if (req.session.isNew) {
    return res.status(404).send('Please log in to access your requested short URL.');
  }
  else if (urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    const user = users[req.session.user_id];
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
    return res.render("urls_show", templateVars);
  }
  else {
    return res.status(404).send('Requested resource belongs to another user.');
  }
});
app.get("/u/:shortURL", (req, res) => {
  //redirect to the actual long url
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//APP.LISTEN REQUEST

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});