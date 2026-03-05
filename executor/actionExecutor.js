async function executeActions(actions) {
  if (!Array.isArray(actions)) return;

  for (const step of actions) {
    const action = step.action || step.type;
    if (!action || !step.selector) continue;

    try {
      const element = await $(step.selector);
      if (!(await element.isExisting())) continue;

      await element.waitForDisplayed({ timeout: 20000 });

      if (action === "click") {
        await element.waitForClickable({ timeout: 20000 });
        await element.click();
      } else if (action === "type") {
        await element.setValue(step.value || "");
      }
    } catch (error) {
      continue;
    }
  }
}

module.exports = { executeActions };
