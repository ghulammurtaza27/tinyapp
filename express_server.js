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

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});





// /urls/:shortURL
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  console.log(req.body.username);  // Log the POST request body to the console
  const username = req.body.username;
  res.cookie('username', username );
  res.redirect(`/urls`);
});



app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});



app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls`);
  //  <form action="/urls/<%= url %>" method="get">
  //    <button class="btn btn-primary" type="submit">Edit</button>
  //  </form>
});
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlDeleted = req.params.shortURL;
  delete urlDatabase[urlDeleted];
  res.redirect("/urls");
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



