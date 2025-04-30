const { Events, Collection } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        // Slash komutlar
        if (interaction.isChatInputCommand()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) {
                console.error(`[HATA] ${interaction.commandName} isimli slash komutu bulunamadı.`);
                try {
                    await interaction.reply({ content: 'Bu komut işlenirken bir hata oluştu!', ephemeral: true });
                } catch (err) {
                    console.error("Interaction reply hatası:", err);
                }
                return;
            }

            // Cooldown kontrolü
            const { cooldowns } = client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({
                        content: `Bu komutu tekrar kullanabilmek için <t:${expiredTimestamp}:R> beklemelisin.`,
                        ephemeral: true
                    });
                }
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            // Komutu çalıştır
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(`[HATA] ${interaction.commandName} komutu çalıştırılırken hata:`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Komut yürütülürken bir hata oluştu!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Komut yürütülürken bir hata oluştu!', ephemeral: true });
                }
            }
        }

        // Buton işlemleri
        else if (interaction.isButton()) {
            console.log(`[BUTTON] ${interaction.customId} tıklandı by ${interaction.user.tag}`);

            if (interaction.customId === 'help-button') {
                require('../helpers/embedManager').sendHelpMenu(interaction, client);
            }
        }

        // Menü işlemleri
        else if (interaction.isStringSelectMenu()) {
            console.log(`[MENU] ${interaction.customId} seçildi by ${interaction.user.tag}`);

            if (interaction.customId === 'help-menu') {
                require('../helpers/embedManager').handleHelpMenu(interaction, client);
            }
        }

        // Diğer etkileşim türleri (isteğe bağlı modal vb.)
    },
};
