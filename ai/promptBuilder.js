function buildPrompt(dom, instructionText) {
    return `Analyze the HTML and complete the task. Return ONLY valid JSON.

HTML DOM:
${dom}

Task:
${instructionText}

Return JSON with CSS selectors or XPath. Example:
{
  "actions": [
    { "type": "click", "selector": ".button" },
    { "type": "type", "selector": "#input", "value": "text" }
  ]
}

JSON response:`;
}

module.exports = { buildPrompt };