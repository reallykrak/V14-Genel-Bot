// Bu yardımcı, belirli emojileri ID veya isimle bulmayı kolaylaştırabilir.
const config = require('../config.json'); // Yapılandırmadaki emojiler için

class EmojiManager {
    /**
     * Yapılandırmadan veya sunucudan bir emoji bulur.
     * @param {import('discord.js').Client} client - Discord Client
     * @param {string} emojiIdentifier - Emoji adı (config'deki) veya ID'si veya Unicode karakteri
     * @param {import('discord.js').Guild} [guild] - Özel emojiler için sunucu (isteğe bağlı)
     * @returns {string | import('discord.js').GuildEmoji | null} - Emoji string'i, Emoji nesnesi veya null
     */
    static getEmoji(client, emojiIdentifier, guild = null) {
        // 1. Yapılandırmadaki isimle eşleşme ara
        if (config.emojis && config.emojis[emojiIdentifier]) {
            const emojiValue = config.emojis[emojiIdentifier];
            // Eğer ID ise veya doğrudan emoji ise, onu bulmaya çalış
             const foundEmoji = client.emojis.cache.get(emojiValue) || guild?.emojis.cache.get(emojiValue);
             if(foundEmoji) return foundEmoji; // Emoji nesnesini döndür
             return emojiValue; // Değilse, config'deki değeri (belki unicode) döndür
        }

        // 2. ID ile doğrudan bulmaya çalış
        let emoji = client.emojis.cache.get(emojiIdentifier);
        if (emoji) return emoji;

        // 3. Belirtilen sunucuda ID ile bulmaya çalış
        if (guild) {
            emoji = guild.emojis.cache.get(emojiIdentifier);
            if (emoji) return emoji;
        }

        // 4. İsimle bulmaya çalış (büyük/küçük harf duyarsız)
        emoji = client.emojis.cache.find(e => e.name.toLowerCase() === emojiIdentifier.toLowerCase());
         if (emoji) return emoji;

         if (guild) {
             emoji = guild.emojis.cache.find(e => e.name.toLowerCase() === emojiIdentifier.toLowerCase());
             if (emoji) return emoji;
         }

        // 5. Unicode emoji olabilir, doğrudan döndür
        // Basit bir unicode kontrolü (bu geliştirilebilir)
        if (/\p{Emoji}/u.test(emojiIdentifier)) {
             return emojiIdentifier;
        }


        // Bulunamadı
        console.warn(`[EmojiManager] Emoji bulunamadı: ${emojiIdentifier}`);
        return null; // Veya varsayılan bir emoji döndür '❓'
    }

     /**
     * Emojiyi metin içinde kullanılabilir formata getirir.
     * @param {string | import('discord.js').GuildEmoji} emojiResolvable - Emoji ID, adı, unicode veya nesnesi
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Guild} [guild]
     * @returns {string} - Metin içinde gösterilecek emoji veya boş string
     */
    static formatEmoji(emojiResolvable, client, guild = null) {
        if (typeof emojiResolvable === 'string') {
            const emoji = this.getEmoji(client, emojiResolvable, guild);
            if (!emoji) return ''; // Bulunamazsa boş döndür
            if (typeof emoji === 'string') return emoji; // Unicode ise doğrudan döndür
            // GuildEmoji ise formatla
            return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
        } else if (emojiResolvable && typeof emojiResolvable === 'object' && emojiResolvable.id) {
             // Doğrudan GuildEmoji nesnesi gelmişse
             return `<${emojiResolvable.animated ? 'a' : ''}:${emojiResolvable.name}:${emojiResolvable.id}>`;
        }
        return ''; // Geçersizse boş döndür
    }
}

module.exports = EmojiManager;

// Kullanım Örneği:
// const Emojis = require('../helpers/emojiManager');
// const successEmoji = Emojis.formatEmoji('success', client); // Config'den alır
// const customEmoji = Emojis.formatEmoji('nitroBoost', client, interaction.guild); // Sunucudan arar
// interaction.reply(`${successEmoji} İşlem tamamlandı! ${customEmoji}`);
               
