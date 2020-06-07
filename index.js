const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;
const mongoose = require("mongoose");

const User = require("./models/user");

mongoose.connect(`${process.env.DatabaseURL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  ".hbs",
  hbs({
    defaultLayout: "layout",
    extname: "hbs",
  })
);
app.set("view engine", ".hbs");

app.get("/", async (req, res) => {
  let user = await User.find({});
  let userArr = user.map((user) => user.toObject());

  res.render("index", { userArr });
});

app.get('/user/:id', async (req, res) => {
  let user = await User.findById(req.params.id);
  // let id = req.params.id;
  res.render('user', {user})
})

app.post("/", async (req, res) => {
  let { username, email, password, birthday } = req.body;
  let existingEmail = await User.findOne({ email })
  let existingUserName = await User.findOne({ username })
  if (existingEmail || existingUserName) {
    let err = new Error(
      `${email} / ${username} A user with that email or username has already registered.`,
    );

    err.status = 400;
    console.log(err);
    res.render('index', {
      errorMessage: `${email} / ${username} A user with that email or username has already registered.`,
    });
    return;
  }
  const user = new User({
    username,
    email,
    password,
    birthday
  });

  await user.save();

  res.redirect("/profile");
});

app.get("/profile", async (req, res) => {
  let user = await User.find({});
  let errorMessage;
  
  let userArr = user.map((user) => user.toObject());
  console.log(user)
  if (user.length === 0) {
    errorMessage = "No users exist."
  }
  else {
    console.log('Users exist. Get in there.')
  }
  

  res.render("profile", { userArr, errorMessage });
});

app.listen(PORT || 3000, () => {
  console.log(`server listening on ${PORT}`);
});
