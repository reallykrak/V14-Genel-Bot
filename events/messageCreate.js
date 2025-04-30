const { Events, Collection } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const prefix = config.prefix;

        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.prefixCommands.get(commandName) || client.prefixCommands.get(client.aliases.get(commandName));
            if (!command) return;

            // Cooldown kontrolü
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
                        .then(msg => setTimeout(() => msg.delete().catch(console.error), 5000));
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            try {
                command.execute(message, args, client);
            } catch (error) {
                console.error(`[HATA] ${command.name} prefix komutu çalıştırılırken hata:`, error);
                message.reply('Bu komut yürütülürken bir hata oluştu!');
            }
        } else {
            // Prefixsiz mesajlar için sistem çağrıları
            client.systems.level?.processMessage(message);
            client.systems.moderation?.checkMessage(message);
        }
    },
};
