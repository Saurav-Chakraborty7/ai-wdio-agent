function buildPrompt(dom, instructionText) {
    return `
You are a QA agent producing WebdriverIO actions in JSON.
Only use selectors found in the HTML; copy them exactly. Prefer
\`#id\` or \`[id=\"value\"]\` when necessary. Do not invent or modify
selectors. If an element is missing, return {"actions": []}.
Use "type" for inputs and "click" for buttons.

CURRENT PAGE HTML:
${dom}

USER INSTRUCTION:
${instructionText}

Respond with JSON, for example:
{"actions":[{"type":"type","selector":"#user-name","value":"standard_user"},
{"type":"click","selector":"#login-button"}]}
`;
}

module.exports = { buildPrompt };