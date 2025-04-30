const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    async createWelcomeCard(user, guild) {
        const canvas = createCanvas(700, 250);
        const context = canvas.getContext('2d');

        // Background - customize or make configurable
        context.fillStyle = '#23272A';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Avatar
        const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 128 }));
        context.drawImage(avatar, 50, 50, 150, 150);

        // Text
        context.font = '40px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText('Hoş geldin,', 250, 100);

        context.font = '50px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(user.tag, 250, 160);

        context.font = '30px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(`Sunucumuza katıldı!`, 250, 200);
        context.fillText(`${guild.memberCount}. üye!`, 50, 230);


        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-card.png' });
        return attachment;
    },

     // Optional: Create a separate canvas for leave messages
     // async createLeaveCard(user, guild) {
     //     // Similar canvas logic for a leave message
     // }
};

