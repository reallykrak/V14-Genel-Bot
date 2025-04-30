const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    async createLevelCard(user, level, xp, requiredXp) {
        const canvas = createCanvas(700, 250);
        const context = canvas.getContext('2d');

        // Background
        context.fillStyle = '#23272A';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Avatar
        const avatar = await loadImage(user.displayAvatarURL({ extension: 'png' }));
        context.drawImage(avatar, 50, 50, 150, 150);

        // Text (User Tag, Level, XP)
        context.font = '40px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(user.tag, 250, 100);

        context.font = '30px sans-serif';
        context.fillText(`Level: ${level}`, 250, 150);
        context.fillText(`XP: ${xp} / ${requiredXp}`, 250, 190);


        // XP Bar (basic example)
         const barWidth = 400;
         const barHeight = 20;
         const barX = 250;
         const barY = 210;
         const progress = Math.min(xp / requiredXp, 1); // Ensure progress doesn't exceed 1

         context.fillStyle = '#72767E'; // Grey bar
         context.fillRect(barX, barY, barWidth, barHeight);

         context.fillStyle = '#42b983'; // Green progress
         context.fillRect(barX, barY, barWidth * progress, barHeight);


        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'level-card.png' });
        return attachment;
    },
};
           
