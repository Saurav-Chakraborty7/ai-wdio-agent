const { runAIInstruction } = require("../../ai/instructionRunner");
const { extractCleanDOM, extractVisibleButtonsDOM } = require("../../executor/domExtractor");

describe("AI Driven Full Flow", () => {
  it("Login + Add To Cart", async function () {
    this.timeout(900000);

    await browser.url("https://www.saucedemo.com/");
    await runAIInstruction(extractCleanDOM, "login.txt");

    const inventory = await $(".inventory_list");
    await inventory.waitForDisplayed({ timeout: 30000 });

    await runAIInstruction(extractVisibleButtonsDOM, "add_to_cart.txt");

    await runAIInstruction(extractCleanDOM, "open_cart.txt");
  });
});
