exports.config = {
    runner: 'local',

    specs: ["./test/specs/**/*.js"],
    exclude: [],

    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome'
    }],

    logLevel: 'silent',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        // LLM calls can be slow, so a generous timeout is needed
        timeout: 900000
    },

    beforeSuite: async function () {
        browser.maximizeWindow();
    },
}
