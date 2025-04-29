const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const systemsPath = path.join(__dirname, '..', 'systems');

    fs.readdirSync(systemsPath).forEach(systemName => {
        const systemFolderPath = path.join(systemsPath, systemName);
        const managerFile = path.join(systemFolderPath, `${systemName}Manager.js`);
        const eventsFile = path.join(systemFolderPath, `${systemName}Events.js`);

        if (fs.existsSync(managerFile)) {
            try {
                const ManagerClass = require(managerFile);
                // Sistemi client objesi altında sakla, client ve config'i ileterek başlat
                client.systems[systemName] = new ManagerClass(client, require('../config.json'));
                console.log(`[SYSTEM] ${systemName} Manager yüklendi.`);

                // İlişkili olayları yükle (varsa)
                if (fs.existsSync(eventsFile)) {
                    const registerSystemEvents = require(eventsFile);
                    if (typeof registerSystemEvents === 'function') {
                        registerSystemEvents(client, client.systems[systemName]); // Sistemi ve client'ı event dosyasına ilet
                        console.log(`[SYSTEM] ${systemName} Events bağlandı.`);
                    }
                }

                // İsteğe bağlı: Sistemin kendi içinde bir init() metodu varsa çağır
                if (client.systems[systemName] && typeof client.systems[systemName].init === 'function') {
                     client.systems[systemName].init();
                }

            } catch (error) {
                console.error(`[HATA] Sistem yüklenemedi (${systemName}):`, error);
            }
        } else {
             console.warn(`[UYARI] ${systemName} sistemi için ${systemName}Manager.js bulunamadı.`);
        }
    });
};
                          
