const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10'); // v10 kullanıyoruz
const config = require('../config.json'); // Veya process.env

module.exports = (client) => {
    const slashCommands = [];
    const prefixCommandsPath = path.join(__dirname, '..', 'commands', 'prefix');
    const slashCommandsPath = path.join(__dirname, '..', 'commands', 'slash');

    // Prefix Komutlarını Yükle
    fs.readdirSync(prefixCommandsPath).forEach(folder => {
        const commandFiles = fs.readdirSync(path.join(prefixCommandsPath, folder)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(prefixCommandsPath, folder, file);
            try {
                const command = require(filePath);
                if (command.name && command.execute) {
                    client.prefixCommands.set(command.name, command);
                    if (command.aliases && Array.isArray(command.aliases)) {
                        command.aliases.forEach(alias => client.aliases.set(alias, command.name));
                    }
                    console.log(`[PREFIX CMD] ${command.name} yüklendi.`);
                } else {
                    console.warn(`[UYARI] ${filePath} geçerli bir prefix komut yapısına sahip değil.`);
                }
            } catch (error) {
                console.error(`[HATA] Prefix komutu yüklenemedi (${filePath}):`, error);
            }
        }
    });

    // Slash Komutlarını Yükle ve Kaydet
    fs.readdirSync(slashCommandsPath).forEach(folder => {
        const commandFiles = fs.readdirSync(path.join(slashCommandsPath, folder)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(slashCommandsPath, folder, file);
            try {
                const command = require(filePath);
                if (command.data && command.execute) {
                    client.slashCommands.set(command.data.name, command);
                    slashCommands.push(command.data.toJSON()); // API'ye göndermek için JSON formatı
                    console.log(`[SLASH CMD] ${command.data.name} yüklendi.`);
                } else {
                    console.warn(`[UYARI] ${filePath} geçerli bir slash komut yapısına sahip değil (data ve execute gerekli).`);
                }
            } catch (error) {
                console.error(`[HATA] Slash komutu yüklenemedi (${filePath}):`, error);
            }
        }
    });

    // Slash komutlarını Discord API'ye kaydet
    const rest = new REST({ version: '10' }).setToken(config.token);

    (async () => {
        try {
            console.log('[API] Slash komutları yenileniyor...');

            // Guild (Sunucu) bazlı komutlar (daha hızlı güncellenir, test için ideal)
            if (config.guildId) {
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, config.guildId),
                    { body: slashCommands },
                );
                console.log(`[API] Slash komutları ${config.guildId} sunucusuna başarıyla kaydedildi.`);
            } else {
            // Global komutlar (tüm sunucularda görünür, güncellenmesi 1 saati bulabilir)
             await rest.put(
                 Routes.applicationCommands(client.user.id),
                 { body: slashCommands },
             );
             console.log('[API] Global slash komutları başarıyla kaydedildi.');
            }

        } catch (error) {
            console.error('[API HATA] Slash komutları kaydedilemedi:', error);
        }
    })();
};
                                 
