import { DictionaryResponse } from "./models/DictionaryResponse";
import express from "express";

require("dotenv").config();
require("isomorphic-fetch");

const app = express(); // initialize the express server

app.use(express.urlencoded({ extended: false }));

// test route
app.get("/", (req, res, next) => {
  res.send("Hello world");
});

app.post("/define", async (req, res) => {
  const { text } = req.body;
  const shortDefs = await fetchDefinition(text);
  res.send(shortDefs[0]);
});

app.get("/define/:word", async (req, res) => {
  const { word } = req.params;
  const shortDefs = await fetchDefinition(word);
  res.send(shortDefs);
});

const fetchDefinition = async (word: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.MW_API_KEY;
    const baseUrl = process.env.MW_BASE_URL;
    const apiVersion = process.env.MW_API_VERS;
    const apiType = process.env.MW_API_TYPE;
    const url = `${baseUrl}/${apiVersion}/references/${apiType}/json/${word}?key=${apiKey}`;
    fetch(url)
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then((definitions: DictionaryResponse[]) => {
        // TODO: handle suggested corrections
        const shortDefs = definitions.map((definition) => {
          return definition.shortdef.reduce(
            (combinedShortDefs, nextShortDef) =>
              combinedShortDefs + ", " + nextShortDef
          );
        });
        resolve(shortDefs);
      })
      .catch((error) => {
        console.error("ERROR ", error);
        reject(error);
      });
  });
};

// Express configuration
app.set("port", process.env.PORT || 4000);

export default app;
