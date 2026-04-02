# ai-wdio-agent

A WebdriverIO-based test automation framework that uses a locally running LLM (via Ollama) to drive browser interactions from plain-text natural language instructions.

Instead of writing explicit selectors in your test code, you describe what you want to do in a `.txt` instruction file. The LLM reads the current page DOM and returns a JSON action plan that the framework executes using WebdriverIO.

---

## How It Works

1. A test navigates to a page using WebdriverIO.
2. The DOM is extracted from the live browser (interactive elements only).
3. The instruction file for the current step is read from `./instructions/`.
4. A prompt is built combining the DOM snapshot and the instruction.
5. The prompt is sent to a locally running Ollama instance (`phi3:mini` model).
6. The LLM responds with a JSON action plan (click, type, etc.).
7. The `actionExecutor` runs each action in the browser via WebdriverIO.

> **Note:** The `add_to_cart` step bypasses the LLM and instead picks a random `add-to-cart-*` button directly from the DOM for reliability.

---

## Project Structure

```
ai-wdio-agent/
├── ai/
│   ├── instructionRunner.js    # Orchestrates DOM extraction, LLM call, and action dispatch
│   ├── llmClient.js            # Sends prompts to Ollama and parses JSON responses
│   ├── promptBuilder.js        # Builds the prompt string from DOM + instruction text
│   └── last_llm_response.json  # Cached last LLM response (git-ignored)
│
├── executor/
│   ├── actionExecutor.js       # Executes click/type actions in the browser
│   └── domExtractor.js         # Extracts interactive elements from the live DOM
│
├── instructions/
│   ├── login.txt               # Instruction: log in with standard_user / secret_sauce
│   ├── add_to_cart.txt         # Instruction: click a random Add to Cart button
│   └── open_cart.txt           # Instruction: click the shopping cart link
│
├── test/
│   └── specs/
│       └── ai.spec.js          # Main test spec: Login + Add To Cart full flow
│
├── wdio.conf.js                # WebdriverIO configuration (Chrome, Mocha, local runner)
├── package.json
└── .gitignore
```

---

## Prerequisites

- **Node.js** v18 or later
- **Google Chrome** installed
- **Ollama** running locally with the `phi3:mini` model pulled

### Install Ollama and pull the model

Download Ollama from [https://ollama.com](https://ollama.com), then run:

```bash
ollama pull phi3:mini
ollama serve
```

Ollama must be listening on `http://localhost:11434` before running tests.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Saurav-Chakraborty7/ai-wdio-agent.git
cd ai-wdio-agent
npm install
```

---

## Running Tests

```bash
npm test
```

This runs `wdio run ./wdio.conf.js`, which executes all spec files under `./test/specs/`.

---

## Configuration

All WebdriverIO settings are in `wdio.conf.js`.

| Setting | Value |
|---|---|
| Runner | `local` |
| Browser | Chrome |
| Framework | Mocha (BDD) |
| Reporter | `spec` |
| Spec pattern | `./test/specs/**/*.js` |
| Test timeout | 900,000 ms (15 min) — LLM calls can be slow |
| `waitforTimeout` | 10,000 ms |
| `connectionRetryTimeout` | 120,000 ms |
| `connectionRetryCount` | 3 |
| Log level | `silent` |

The browser window is maximized automatically before each suite via the `beforeSuite` hook.

---

## Writing Instructions

Instruction files live in `./instructions/` and are plain `.txt` files. Each file describes one logical step. The file is passed verbatim to the LLM alongside the page DOM.

**Guidelines when writing instructions:**

- Be specific about what to find and what action to take.
- Reference element attributes (id, class, placeholder) to help the LLM pick the right selector.
- Require the LLM to return only valid JSON — no markdown, no comments.
- Specify the exact expected output format.

Example (`login.txt`):
```
Complete the login process:
1. Find the username input field and enter: standard_user
2. Find the password input field and enter: secret_sauce
3. Click the login button

Look for inputs by their id, name, or placeholder attributes.
```

---

## Dependencies

### devDependencies

| Package | Version |
|---|---|
| `@wdio/cli` | ^9.24.0 |
| `@wdio/local-runner` | ^9.24.0 |
| `@wdio/mocha-framework` | ^9.24.0 |
| `@wdio/spec-reporter` | ^9.24.0 |

### dependencies

| Package | Version | Purpose |
|---|---|---|
| `axios` | ^1.13.5 | HTTP client for calling the Ollama API |
| `dotenv` | ^17.3.1 | Environment variable support |
| `node-fetch` | ^3.3.2 | Fetch API for Node.js |

---

## LLM Configuration

The LLM client (`ai/llmClient.js`) is hardcoded to:

- **Endpoint:** `http://localhost:11434/api/generate`
- **Model:** `phi3:mini`
- **Retries:** 2 attempts with a 2-second delay between them
- **Timeout:** 120,000 ms per request

To use a different Ollama model, update the `model` field in `ai/llmClient.js`.

---

## License

ISC
