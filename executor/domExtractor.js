async function extractCleanDOM() {
  return await browser.execute(() => {
    const elements = document.querySelectorAll('input, button, a, select, textarea, [role="button"]');
    let result = '';
    
    elements.forEach(el => {
      const id = el.id ? ` id="${el.id}"` : '';
      const name = el.name ? ` name="${el.name}"` : '';
      const cls = el.className ? ` class="${el.className}"` : '';
      const placeholder = el.placeholder ? ` placeholder="${el.placeholder}"` : '';
      const type = el.type ? ` type="${el.type}"` : '';
      const text = el.innerText ? el.innerText.trim().slice(0, 40) : '';
      const tag = el.tagName.toLowerCase();
      result += `<${tag}${id}${name}${cls}${type}${placeholder}>${text}</${tag}>\n`;
    });
    return result;
  });
}

async function extractVisibleButtonsDOM() {
  return await browser.execute(() => {
    const buttons = document.querySelectorAll('button:not([style*="display: none"])');
    let result = '';
    
    Array.from(buttons).forEach(btn => {
      if (btn.offsetHeight > 0 && btn.offsetWidth > 0) {
        const id = btn.id ? ` id="${btn.id}"` : '';
        const cls = btn.className ? ` class="${btn.className}"` : '';
        const text = btn.innerText ? btn.innerText.trim().slice(0, 50) : '';
        result += `<button${id}${cls}>${text}</button>\n`;
      }
    });
    return result || '<button>No visible buttons found</button>';
  });
}

module.exports = { extractCleanDOM, extractVisibleButtonsDOM };