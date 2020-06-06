"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
//declare the homepage function
const handleHomepage = (req, res) => {
  res
    .status(200)
    .render("./pages/homepage", { users: users, currentUser: currentUser });
};

//declare the personal page function

const handleProfile = (req, res) => {
  const userID = req.params.id;
  const user = users.find((user) => user._id === userID);
  const friends = users.filter((potentialFriend) =>
    user.friends.includes(potentialFriend._id)
  );

  res.status(200).render("./pages/profile", {
    user: user,
    friends: friends,
    currentUser: currentUser,
  });
};

const handleSignin = (req, res) => {
  if (currentUser.name) {
    res.render("./pages/homepage", { users: users, currentUser: currentUser });
  } else {
    res.status(200).render("./pages/signin", { currentUser: currentUser });
  }
};

const handleName = (req, res) => {
  const firstName = req.query.firstName;
  const user = users.find((user) => user.name === firstName);
  currentUser = user;

  if (user) {
    const friends = users.filter((potentialFriend) =>
      user.friends.includes(potentialFriend._id)
    );
    res.status(200).render("./pages/profile", {
      user: user,
      friends: friends,
      currentUser: currentUser,
    });
  } else {
    res.status(404).redirect("signin");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:id", handleProfile)
  .get("/signin", handleSignin)
  .get("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
