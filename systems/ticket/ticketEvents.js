module.exports = class TicketEvents {
    constructor(client) {
        this.client = client;
        this.ticketManager = client.systems.get('ticket');
    }

    async handleChannelDelete(channel) {
        // Your logic to handle ticket channels being deleted manually
    }
};
