const fs = require("fs");
const { askLLM } = require("./llmClient");
const { buildPrompt } = require("./promptBuilder");
const { executeActions } = require("../executor/actionExecutor");

async function runAIInstruction(domExtractor, instructionFile) {
  const instruction = fs.readFileSync(`./instructions/${instructionFile}`, "utf-8");
  const dom = await domExtractor();

  let parsed;
  if (instructionFile === "add_to_cart.txt") {
    // Find all add-to-cart button ids
    const idMatches = dom.match(/id="([^"]*add-to-cart[^"]*)"/g);
    if (!idMatches || idMatches.length === 0) {
      parsed = { actions: [] };
    } else {
      const ids = idMatches.map(match => match.match(/id="([^"]*)"/)[1]);
      const randomIndex = Math.floor(Math.random() * ids.length);
      const randomId = ids[randomIndex];
      console.log(`Adding product at index ${randomIndex + 1} to cart`);
      parsed = { actions: [{ type: "click", selector: "#" + randomId }] };
    }
  } else {
    const prompt = buildPrompt(dom, instruction);
    const llmResponse = await askLLM(prompt);
    parsed = JSON.parse(llmResponse);
  }

  const typeActions = parsed.actions.filter(
    (a) => a.type === "type" || (a.type === "click" && a.selector.match(/input|textarea/i))
  );
  const clickActions = parsed.actions.filter(
    (a) => a.type === "click" && !a.selector.match(/input|textarea/i)
  );

  if (typeActions.length) await executeActions(typeActions);
  if (clickActions.length) await executeActions(clickActions);
}

module.exports = { runAIInstruction };
