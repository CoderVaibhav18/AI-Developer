import { generateResult } from "../services/geminiService.js";

const geminiResult = async (req, res) => {
  try {
    const { prompt } = req.query;

    const result = await generateResult(prompt);
    return res.send(result);
  } catch (err) {
    return res.send("err" + err.message);
  }
};

export { geminiResult };
