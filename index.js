// MAIN SCRIPT FOR SERVER
var visitCount = 0;

console.log("started");

const express = require("express");
const router = express.Router();
const app = express();

const fs = require("fs");

//////////////////////////////////////////////////////
app.use(express.static("public"));
app.use("/", router);
//////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello Worl!");
});

//////////////////////////////////////////////////////

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
