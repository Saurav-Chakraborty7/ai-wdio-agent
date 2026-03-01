const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, 'last_llm_response.json');

async function askLLM(prompt) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama3',
            prompt,
            stream: false
        }, { timeout: 120000, signal: controller.signal });

        clearTimeout(timer);
        const resText = response.data.response;
        try { fs.writeFileSync(CACHE_PATH, resText, 'utf8'); } catch (e) {}
        return resText;
    } catch (error) {
        clearTimeout(timer);
        try { return fs.readFileSync(CACHE_PATH, 'utf8'); } catch (e) { throw error; }
    }
}

module.exports = { askLLM };