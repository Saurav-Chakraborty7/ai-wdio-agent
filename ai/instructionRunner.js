const fs = require("fs");
const { askLLM } = require("./llmClient");
const { buildPrompt } = require("./promptBuilder");
const { executeActions } = require("../executor/actionExecutor");

async function runAIInstruction(domExtractor, instructionFile) {
  const instruction = fs.readFileSync(`./instructions/${instructionFile}`, "utf-8");
  const dom = await domExtractor();
  const prompt = buildPrompt(dom, instruction);
  const llmResponse = await askLLM(prompt);
  const parsed = JSON.parse(llmResponse);

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
