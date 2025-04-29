const mongoose = require('mongoose');
const config = require('../config.json'); // DB URI için

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        console.log('[DB] Zaten bağlı.');
        return;
    }

    if (!config.database || !config.database.mongoURI) {
        console.error('[DB HATA] MongoDB bağlantı URI bulunamadı (config.json -> database.mongoURI).');
        // process.exit(1); // Bağlantı zorunluysa botu durdur
        return;
    }

    try {
        await mongoose.connect(config.database.mongoURI, {
            // Yeni Mongoose sürümlerinde bu seçenekler varsayılan olabilir veya kaldırılmış olabilir.
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false, // Eski sürümler için
            // useCreateIndex: true, // Eski sürümler için
        });
        isConnected = true;
        console.log('[DB] MongoDB bağlantısı başarılı!');

        mongoose.connection.on('error', err => {
            console.error('[DB HATA] MongoDB bağlantı hatası:', err);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('[DB] MongoDB bağlantısı kesildi.');
            isConnected = false;
            // İsteğe bağlı: Yeniden bağlanmayı dene
            // setTimeout(connectDB, 5000);
        });

    } catch (error) {
        console.error('[DB HATA] MongoDB bağlantısı kurulamadı:', error);
        // process.exit(1); // Bağlantı zorunluysa botu durdur
    }
}

// Veritabanı modellerini (Schemas) yönetmek için bir fonksiyon (isteğe bağlı)
function loadModels() {
     const modelsPath = path.join(__dirname, '..', 'models'); // Eğer /models klasörü varsa
     if (fs.existsSync(modelsPath)) {
         fs.readdirSync(modelsPath).filter(file => file.endsWith('.js')).forEach(file => {
             require(path.join(modelsPath, file));
             console.log(`[DB] Model yüklendi: ${file}`);
         });
     }
}

module.exports = {
    connectDB,
    // loadModels, // Kullanacaksan export et
    // Mongoose nesnesini veya bağlantıyı da export edebilirsin:
    // connection: mongoose.connection
};

// Kullanım örneği (index.js içinde):
// const db = require('./helpers/database');
// db.connectDB();
// db.loadModels(); // Eğer modelleri ayrı dosyada tutuyorsan
