async function executeActions(actions) {
    if (!Array.isArray(actions)) {
        throw new Error('Actions must be an array');
    }

    for (const action of actions) {

        if (!action.type || !action.selector) {
            throw new Error(`Invalid action format: ${JSON.stringify(action)}`);
        }

        if (!['click', 'type'].includes(action.type)) {
            throw new Error(`Unsupported action type: ${action.type}`);
        }

        try {
            const el = await $(action.selector);
            await el.waitForDisplayed({ timeout: 5000 });

            console.log(`➡️ ${action.type.toUpperCase()} → ${action.selector}`);

            if (action.type === 'click') {
                await el.click();
            }

            if (action.type === 'type') {
                await el.setValue(action.value);
            }

        } catch (error) {
            console.error('❌ Execution failed:', action, error.message);
            throw error;
        }
    }
}

module.exports = { executeActions };