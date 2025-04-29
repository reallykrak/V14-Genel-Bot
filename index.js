// Gerekli Discord.js modüllerini ve diğerlerini içe aktar
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Yapılandırmayı yükle (token vb. için)
// .env kullanıyorsan: require('dotenv').config(); const config = process.env;
const config = require('./config.json');

// İstemci (Client) oluştur ve Gerekli Intent'leri belirle
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Mesaj içeriğini okumak için (Privileged Intent)
        GatewayIntentBits.GuildMembers,   // Üye giriş/çıkış olayları için (Privileged Intent)
        GatewayIntentBits.GuildPresences, // İsteğe bağlı, üye durumları için
        // ... ihtiyacına göre diğer Intent'leri ekle
    ]
});

// Komutları, olayları ve sistemleri saklamak için Collection'lar
client.commands = new Collection();
client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.aliases = new Collection(); // Prefix komutları için takma adlar (isteğe bağlı)
client.cooldowns = new Collection(); // Bekleme süreleri için (isteğe bağlı)
client.systems = {}; // Sistem modüllerini saklamak için

// Yükleyicileri (Loaders) çalıştır
const loadersPath = path.join(__dirname, 'loaders');
const loaderFiles = fs.readdirSync(loadersPath).filter(file => file.endsWith('.js'));

for (const file of loaderFiles) {
    const filePath = path.join(loadersPath, file);
    const loader = require(filePath);
    if (typeof loader === 'function') {
        loader(client); // Her yükleyiciyi client ile başlat
        console.log(`[LOADER] ${file} yüklendi.`);
    } else {
        console.error(`[HATA] Yükleyici dosyası (${file}) bir fonksiyon export etmiyor.`);
    }
}

// Discord'a giriş yap
client.login(config.token)
    .then(() => {
        console.log(`[CLIENT] ${client.user.tag} olarak giriş yapıldı!`);
    })
    .catch(err => {
        console.error('[HATA] Giriş yapılamadı:', err);
    });

// (İsteğe Bağlı) Yakalanmayan Hataları Ele Alma
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    // process.exit(1); // Kritik hatalarda botu durdurmak isteyebilirsin
});
