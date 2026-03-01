async function executeActions(actions) {
    if (!actions || !Array.isArray(actions)) {
        throw new Error('Actions must be an array');
    }

    for (const action of actions) {
        try {
            if (action.type === 'click') {
                const el = await $(action.selector);
                await el.waitForDisplayed();
                await el.click();
            }

            if (action.type === 'type') {
                const el = await $(action.selector);
                await el.setValue(action.value);
            }
        } catch (error) {
            console.error('Error executing action', action, error.message);
            throw error;
        }
    }
}

module.exports = { executeActions };