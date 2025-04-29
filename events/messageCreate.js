const { Events, Collection } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        // Bot mesajlarını veya DM'leri yoksay (isteğe bağlı)
        if (message.author.bot || !message.guild) return;

        // --- Prefix Komut İşleme ---
        const prefix = config.prefix; // Yapılandırmadan prefix'i al
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.prefixCommands.get(commandName) || client.prefixCommands.get(client.aliases.get(commandName));

            if (!command) return; // Komut bulunamadıysa çık

             // Cooldown (Bekleme Süresi) Kontrolü (Slash ile benzer)
            const { cooldowns } = client;
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

            if (timestamps.has(message.author.id)) {
                 const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return message.reply(`Bu komutu tekrar kullanabilmek için <t:${expiredTimestamp}:R> beklemelisin.`)
                        .then(msg => setTimeout(() => msg.delete().catch(console.error), 5000)); // Mesajı 5 sn sonra sil
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            // İzin Kontrolleri (İsteğe bağlı)
            // if (command.permissions) {
            //     const authorPerms = message.channel.permissionsFor(message.author);
            //     if (!authorPerms || !authorPerms.has(command.permissions)) {
            //         return message.reply('Bu komutu kullanmak için yeterli iznin yok!');
            //     }
            // }

            // Komutu çalıştırmayı dene
            try {
                command.execute(message, args, client); // message, args ve client'ı ilet
            } catch (error) {
                console.error(`[HATA] ${command.name} prefix komutu çalıştırılırken hata:`, error);
                message.reply('Bu komut yürütülürken bir hata oluştu!');
            }
        } else {
             // Prefix ile başlamayan mesajlar için işlemler
             // Örneğin: Level sistemi için mesaj sayma, küfür filtresi vb.
             client.systems.level?.processMessage(message); // Seviye sistemine mesajı ilet
             client.systems.moderation?.checkMessage(message); // Moderasyon sistemine mesajı ilet
        }
    },
};
                      
