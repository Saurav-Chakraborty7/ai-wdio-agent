const { runInstruction } = require('../../ai/runInstruction');

describe('AI Driven Test', () => {

    it('TC-001: Login', async () => {
        await browser.url('https://www.saucedemo.com/');

        await runInstruction('login.txt');
        await browser.pause(2000);
    });

});