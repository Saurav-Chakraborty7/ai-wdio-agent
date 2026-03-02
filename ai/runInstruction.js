const fs = require('fs');
const path = require('path');
const { askLLM } = require('./llmClient');
const { buildPrompt } = require('./promptBuilder');
const { executeActions } = require('../executor/actionExecutor');

async function runInstruction(fileName) {
    const filePath = path.join(__dirname, '..', 'instructions', fileName);
    const instruction = fs.readFileSync(filePath, 'utf-8');

    const dom = await browser.getPageSource();
    const prompt = buildPrompt(dom, instruction);

    console.log(`\n🧠 Running instruction: ${fileName}`);
    const llmResponse = await askLLM(prompt);

    let parsed;
    try {
        parsed = JSON.parse(llmResponse);
    } catch (err) {
        console.error("❌ Invalid JSON from LLM:\n", llmResponse);
        throw err;
    }

    await executeActions(parsed.actions);
}

module.exports = { runInstruction };