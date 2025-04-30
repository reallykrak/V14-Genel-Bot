module.exports = class GiveawayDatabase {
    constructor(client) {
        this.db = client.utils.database.giveaways;
    }

    async createGiveaway(giveawayId, data) {
        return this.db.set(giveawayId, data);
    }

    async getGiveaway(giveawayId) {
        return this.db.get(giveawayId);
    }

    async deleteGiveaway(giveawayId) {
        return this.db.delete(giveawayId);
    }

    async getAllActiveGiveaways() {
        // Return all giveaways where status is 'active' or similar
        return this.db.filter(g => g.status === 'active');
    }
};
