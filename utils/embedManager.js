const { EmbedBuilder } = require('discord.js');
const config = require('../config.json'); // Renkler vb. için

class EmbedManager {
    static success(description) {
        return new EmbedBuilder()
            .setColor(config.colors.success || '#57F287')
            .setDescription(`${config.emojis.success || '✅'} ${description}`)
            .setTimestamp();
    }

    static error(description) {
        return new EmbedBuilder()
            .setColor(config.colors.error || '#ED4245')
            .setDescription(`${config.emojis.error || '❌'} ${description}`)
            .setTimestamp();
    }

    static warning(description) {
         return new EmbedBuilder()
            .setColor(config.colors.warning || '#FEE75C')
            .setDescription(`${config.emojis.warning || '⚠️'} ${description}`)
            .setTimestamp();
    }

    static info(title, description) {
        return new EmbedBuilder()
            .setColor(config.colors.primary || '#5865F2')
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    }

    // ... diğer özel embed türleri (örneğin, kullanıcı profili, yardım menüsü vb.)
    static userProfile(user, profileData) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`${user.username}'s Profile`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'Level', value: profileData.level.toString(), inline: true },
                { name: 'XP', value: `${profileData.xp}/${profileData.nextLevelXp}`, inline: true },
                { name: 'Balance', value: `${profileData.balance} ${config.economy.currency || '$'}`, inline: true }
                //... Diğer alanlar
            )
            .setFooter({ text: `Joined: ${user.joinedAt.toLocaleDateString()}` })
            .setTimestamp();
        return embed;
    }
}

module.exports = EmbedManager;

// Kullanım örneği (başka bir dosyada):
// const Embeds = require('../helpers/embedManager');
// interaction.reply({ embeds: [Embeds.success('İşlem başarılı!')] });
          
