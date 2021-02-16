const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/", (req, res) => {
  res.redirect('/urls');
});


app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});
// /urls/:shortURL
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



