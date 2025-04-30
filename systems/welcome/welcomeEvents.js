module.exports = class WelcomeEvents {
    constructor(client) {
        this.client = client;
        this.welcomeManager = client.systems.get('welcome');

        // handleMemberJoin and handleMemberLeave are already handled in events/guildMemberAdd/Remove.js
        // This file might be used for other specific welcome/leave related events if any
    }
};
