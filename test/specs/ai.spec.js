const fs = require('fs');
const { askLLM } = require('../../ai/llmClient');
const { buildPrompt } = require('../../ai/promptBuilder');
const { executeActions } = require('../../executor/actionExecutor');

describe('AI Driven Test', () => {

    it('TC-001: Should execute instructions via AI', async () => {
        await browser.url('https://www.saucedemo.com/');

        const instruction = fs.readFileSync('./instructions/login.txt', 'utf-8');
        const dom = await browser.getPageSource();
        const prompt = buildPrompt(dom, instruction);
        const llmResponse = await askLLM(prompt);
        const parsed = JSON.parse(llmResponse);
        await executeActions(parsed.actions);
    });

});