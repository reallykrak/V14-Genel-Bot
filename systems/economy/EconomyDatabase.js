module.exports = class EconomyDatabase {
    constructor(client) {
        this.db = client.utils.database.economy;
    }

    async getUserData(userId) {
        return this.db.get(userId);
    }

    async setUserData(userId, data) {
        return this.db.set(userId, data);
    }
};
