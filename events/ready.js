const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady, // Olayın adı
    once: true, // Sadece bir kere çalışsın
    execute(client) {
        console.log(`[READY] ${client.user.tag} hazır ve aktif!`);
        // İsteğe bağlı: Botun durumunu ayarla (oynuyor, izliyor vb.)
        client.user.setActivity('Discord Sunucuları', { type: 'WATCHING' });

        // Sistemlerin init fonksiyonlarını burada da çağırabilirsin (loader sonrası garanti)
        // Object.values(client.systems).forEach(system => {
        //     if (system && typeof system.init === 'function') {
        //         system.init();
        //     }
        // });
    },
};
