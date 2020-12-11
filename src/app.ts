import express from "express";

require("dotenv").config();
require("isomorphic-fetch");

const app = express(); // initialize the express server

// test route
app.get("/", (req, res, next) => {
  res.send("Hello world");
});

app.get("/define/:word", (req, res) => {
  const apiKey = process.env.MW_API_KEY;
  const baseUrl = process.env.MW_BASE_URL;
  const apiVersion = process.env.MW_API_VERS;
  const apiType = process.env.MW_API_TYPE;
  const { word } = req.params;
  const url = `${baseUrl}/${apiVersion}/references/${apiType}/json/${word}?key=${apiKey}`;
  console.log("URL ", url);
  fetch(url)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then((definition) => {
      res.send(definition);
    })
    .catch((error) => {
      console.error("ERROR ", error);
    });
});

// Express configuration
app.set("port", process.env.PORT || 4000);

export default app;
