module.exports = class TicketDatabase {
    constructor(client) {
        this.db = client.utils.database.tickets;
    }

    async getTicketByUserId(userId) {
        return this.db.get(userId);
    }

    async getTicketByChannelId(channelId) {
        return this.db.find(t => t.channelId === channelId);
    }

    async saveTicket(userId, ticketData) {
        return this.db.set(userId, ticketData);
    }

    async deleteTicket(userId) {
        return this.db.delete(userId);
    }
};
