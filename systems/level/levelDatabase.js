module.exports = class LevelDatabase {
    constructor(client) {
        this.db = client.utils.database.levels;
    }

    async getUserLevelData(userId, guildId) {
        const key = `${guildId}-${userId}`;
        return this.db.get(key);
    }

    async setUserLevelData(userId, guildId, data) {
        const key = `${guildId}-${userId}`;
        return this.db.set(key, data);
    }
};
