import * as defineController from "./controllers/define";

import express from "express";

require("dotenv").config();
require("isomorphic-fetch");

const app = express(); // initialize the express server

app.use(express.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.send("This is an API to handle Slack slash commands");
});

app.post("/define", defineController.postSlackDefine);
app.get("/define/:word", defineController.getDefine);

app.set("port", process.env.PORT || 4000);

export default app;
