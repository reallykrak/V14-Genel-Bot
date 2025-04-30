module.exports = class WelcomeManager {
    constructor(client) {
        this.client = client;
        this.database = client.utils.database.welcome;
        this.welcomeCanvas = require('./welcomeCanvas');
    }

    async handleMemberJoin(member) {
        // Your logic to send welcome message/image
        const guildId = member.guild.id;
        const settings = this.database.get(guildId); // Get guild-specific settings

        if (!settings || !settings.channelId) {
            return; // No welcome channel configured
        }

        const channel = member.guild.channels.cache.get(settings.channelId);
        if (!channel) {
             console.warn(`[WELCOME] Welcome channel not found for guild ${member.guild.name}: ${settings.channelId}`);
             return;
        }

        try {
             const welcomeImage = await this.welcomeCanvas.createWelcomeCard(member.user, member.guild);
             const welcomeMessage = settings.message || `Hoş geldin, ${member}! Sunucumuza katıldın!`; // Default message

             await channel.send({ content: welcomeMessage, files: [welcomeImage] });

        } catch (error) {
             console.error(`[WELCOME] Error sending welcome message/image for ${member.user.tag}:`, error);
        }
    }

    async handleMemberLeave(member) {
        // Your logic to send leave message
        const guildId = member.guild.id;
        const settings = this.database.get(guildId);

        if (!settings || !settings.leaveChannelId) { // Assuming separate channel for leave messages
            return;
        }

        const channel = member.guild.channels.cache.get(settings.leaveChannelId);
        if (!channel) {
             console.warn(`[WELCOME] Leave channel not found for guild ${member.guild.name}: ${settings.leaveChannelId}`);
             return;
        }

         const leaveMessage = settings.leaveMessage || `${member.user.tag} aramızdan ayrıldı.`;

        try {
             // Optional: Create a leave image using welcomeCanvas
             // const leaveImage = await this.welcomeCanvas.createLeaveCard(member.user, member.guild);
             // await channel.send({ content: leaveMessage, files: [leaveImage] });
             await channel.send({ content: leaveMessage });
        } catch (error) {
            console.error(`[WELCOME] Error sending leave message for ${member.user.tag}:`, error);
        }
    }

    async setWelcomeChannel(guildId, channelId) {
        // Your logic to save welcome channel settings
        const settings = this.database.get(guildId) || {};
        settings.channelId = channelId;
        this.database.set(guildId, settings);
    }

    async setWelcomeMessage(guildId, message) {
         // Your logic to save welcome message settings
         const settings = this.database.get(guildId) || {};
         settings.message = message;
         this.database.set(guildId, settings);
    }
};
               
