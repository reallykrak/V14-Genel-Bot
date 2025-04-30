module.exports = class LevelEvents {
    constructor(client) {
        this.client = client;
        this.levelManager = client.systems.get('level');

        // Example: Handle message events for XP gain (called from messageCreate)
        // client.on('messageCreate', this.handleMessageXp.bind(this)); // Not recommended here
    }

    async handleMessageXp(message) {
        // Your logic to give XP based on message content/frequency
    }

     async handleVoiceStateUpdate(oldState, newState) {
        // Delegate to manager
         await this.levelManager.handleVoiceStateUpdate(oldState, newState);
     }
};
