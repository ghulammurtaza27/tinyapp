const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});







// /urls/:shortURL
app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  console.log(user);
  const templateVars = { urls: urlDatabase, user, userID: req.cookies["user_id"], };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user, userID: req.cookies["user_id"], };
  res.render("urls_new", templateVars);
});



function generateRandomString() {
  let r = Math.random().toString(36).substring(7);
  return r;
}

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);        // Respond with 'Ok' (we will replace this)
});

app.post("/login", (req, res) => {
  console.log(req.body.email);  // Log the POST request body to the console
  const { email, password } = req.body;

  for (let user in users) {
    console.log(user);
    if (users[user].email === email) {
        console.log(users[user].email);
       if (users[user].password === password) {
        res.cookie('user_id', user);
        return res.redirect('/login');
      }
    }
  }
  return res.status(403).send("Log In info is invalid.");
});

app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
  console.log("loginpage hit");
  res.render("login", templateVars);
  
});



app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  console.log("logout attempted")
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
  console.log("register page hit");
  res.render("register", templateVars);
  
});

// If the e-mail or password are empty strings, send back a response with the 400 status code.
// // If someone tries to register with an email that is already in the users object, send back a response with the 400 status code. Checking for an email in the users object is something we'll need to do in other routes as well. Consider creating an email lookup helper function to keep your code DRY

app.post("/register", (req, res) =>  {
  const { email, password } = req.body;
  if (email === "") {
    return res.status(400).send("Email cannot be empty");
  }
  for (let user in users) {
    if (users[user].email === email) {
       return res.status(400).send("This email already exists");
    }
  }
  const userId = generateRandomString();
  const userObj = {
    userId,
    email,
    password, 
  }
  users[userId] = userObj;
  res.cookie('user_id', userId);
  console.log(users);
  res.redirect("/urls");
});


app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlDeleted = req.params.shortURL;
  delete urlDatabase[urlDeleted];
  res.redirect("/urls");
});
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



