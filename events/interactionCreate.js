const { Events, Collection } = require('discord.js');
const config = require('../config.json'); // Gerekirse prefix veya diğer ayarlar için

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        // Etkileşimin bir slash komutu olup olmadığını kontrol et
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

            // Cooldown (Bekleme Süresi) Kontrolü (İsteğe Bağlı)
            const { cooldowns } = client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3; // Saniye cinsinden varsayılan bekleme süresi
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000; // Milisaniyeye çevir

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({ content: `Bu komutu tekrar kullanabilmek için <t:${expiredTimestamp}:R> beklemelisin.`, ephemeral: true });
                }
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);


            // Komutu çalıştırmayı dene
            try {
                await command.execute(interaction, client); // Client'ı da komuta iletmek faydalı olabilir
            } catch (error) {
                console.error(`[HATA] ${interaction.commandName} komutu çalıştırılırken hata:`, error);
                if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'Komut yürütülürken bir hata oluştu!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'Komut yürütülürken bir hata oluştu!', ephemeral: true });
				}
            }
        }
        // Diğer etkileşim türleri (buton, menü vb.) için kontroller
        else if (interaction.isButton()) {
            // Button ID'sine göre işlem yap
            // Örneğin: if (interaction.customId === 'ticket-olustur') { ... }
             console.log(`[BUTTON] ${interaction.customId} tıklandı by ${interaction.user.tag}`);
             // İlgili sistemi veya helper'ı çağırabilirsin
             // Örneğin: client.systems.ticket?.handleButton(interaction);
        }
        else if (interaction.isStringSelectMenu()) { // Veya AnySelectMenu
             // Seçim menüsü işlemleri
             console.log(`[MENU] ${interaction.customId} seçildi by ${interaction.user.tag}`);
             // Örneğin: client.systems.moderation?.handleMenu(interaction);
        }
        // ... Diğer etkileşim türleri (ModalSubmit vb.)
    },
};
                                             
