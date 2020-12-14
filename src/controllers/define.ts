import { Request, Response } from "express";

import { DictionaryResponse } from "../models/DictionaryResponse";
import { SlackCommand } from "../models/SlackCommand";

export const postSlackDefine = async (req: Request, res: Response) => {
  const { text } = req.body as SlackCommand;
  const shortDefs = await fetchDefinition(text);
  res.send(shortDefs[0]);
};

export const getDefine = async (req: Request, res: Response) => {
  const { word } = req.params;
  const shortDefs = await fetchDefinition(word);
  res.send(shortDefs);
};

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
