module.exports = class EconomyManager {
    constructor(client) {
        this.client = client;
        this.database = client.utils.database.economy;
    }

    async getBalance(userId) {
        return this.database.get(userId) || 0;
    }

    async addMoney(userId, amount) {
        if (amount <= 0) return;
        this.database.ensure(userId, 0);
        this.database.math(userId, '+', amount);
    }

    async removeMoney(userId, amount) {
        if (amount <= 0) return false;
        const currentBalance = await this.getBalance(userId);
        if (currentBalance < amount) {
            return false;
        }
        this.database.math(userId, '-', amount);
        return true;
    }

    async handleButtonInteraction(interaction) {
        // Your economy button handling logic here
        console.log(`[ECONOMY] Handling button: ${interaction.customId}`);
    }
};
      
