const axios = require("axios");
const fs = require("fs");
const path = require("path");

const CACHE_PATH = path.join(__dirname, "last_llm_response.json");

async function askLLM(prompt, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending to Ollama (attempt ${attempt}/${retries})...`);
      const response = await axios.post(
        "http://localhost:11434/api/generate",
        {
          model: "phi3:mini",
          prompt: prompt,
          stream: false,
        },
        { timeout: 120000 }
      );

      const resText = response.data.response;
      const start = resText.indexOf("{");
      const end = resText.lastIndexOf("}");
      
      if (start === -1 || end === -1) throw new Error("No valid JSON found");

      const cleanJson = resText.substring(start, end + 1).trim();
      fs.writeFileSync(CACHE_PATH, cleanJson, "utf8");
      console.log("✓ LLM response processed");
      return cleanJson;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

module.exports = { askLLM };
