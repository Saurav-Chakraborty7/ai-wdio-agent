function buildPrompt(dom, instructionText) {
    return `
You are a QA automation agent that generates WebdriverIO actions.

STRICT RULES:
1. Use ONLY selectors that EXIST in the HTML shown below.
2. COPY selectors EXACTLY as they appear in the HTML - character for character.
3. For attribute selectors with special chars, use CSS attribute syntax: [id="actual-id"]
4. Prefer selectors in this order:
   - id attribute using #id
   - For IDs with special chars (., :, etc), use [id="id-value"]
5. NEVER invent or modify selectors.
6. If element not found in HTML → return empty actions array.
7. For typing in inputs use action "type".
8. For buttons use action "click".
9. Return ONLY JSON.

CURRENT PAGE HTML:
${dom}

USER INSTRUCTION:
${instructionText}

Return EXACTLY this format:

{
  "actions": [
    { "type": "type", "selector": "#user-name", "value": "standard_user" },
    { "type": "type", "selector": "#password", "value": "secret_sauce" },
    { "type": "click", "selector": "#login-button" }
  ]
}

JSON:
`;
}

module.exports = { buildPrompt };