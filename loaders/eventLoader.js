const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        try {
            const event = require(filePath);
            if (event.name && typeof event.execute === 'function') {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                console.log(`[EVENT] ${event.name} (${file}) yüklendi.`);
            } else {
                 console.warn(`[UYARI] ${filePath} geçerli bir olay yapısına sahip değil (name ve execute gerekli).`);
            }
        } catch (error) {
            console.error(`[HATA] Olay yüklenemedi (${filePath}):`, error);
        }
    }
};
      
