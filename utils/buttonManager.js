const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

class ButtonManager {
    /**
     * Basit bir onay/iptal butonu satırı oluşturur.
     * @param {string} confirmId - Onay butonunun customId'si
     * @param {string} cancelId - İptal butonunun customId'si
     * @returns {ActionRowBuilder<ButtonBuilder>}
     */
    static createConfirmCancel(confirmId = 'confirm', cancelId = 'cancel') {
        const confirmButton = new ButtonBuilder()
            .setCustomId(confirmId)
            .setLabel('Onayla')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const cancelButton = new ButtonBuilder()
            .setCustomId(cancelId)
            .setLabel('İptal')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('❌');

        return new ActionRowBuilder().addComponents(confirmButton, cancelButton);
    }

     /**
     * Link butonu oluşturur.
     * @param {string} label - Buton metni
     * @param {string} url - Yönlendirilecek URL
     * @returns {ButtonBuilder}
     */
    static createLinkButton(label, url) {
        return new ButtonBuilder()
            .setLabel(label)
            .setURL(url)
            .setStyle(ButtonStyle.Link)
            .setEmoji('🔗'); // Opsiyonel
    }

    // ... Diğer sık kullanılan buton setleri (örneğin, sayfalama butonları)
     /**
     * Sayfalama butonları oluşturur (Önceki/Sonraki).
     * @param {string} previousId
     * @param {string} nextId
     * @param {boolean} isFirstPage - Önceki butonu devre dışı bırakmak için
     * @param {boolean} isLastPage - Sonraki butonu devre dışı bırakmak için
     * @returns {ActionRowBuilder<ButtonBuilder>}
     */
    static createPagination(previousId = 'prev', nextId = 'next', isFirstPage = false, isLastPage = false) {
        const previousButton = new ButtonBuilder()
            .setCustomId(previousId)
            .setLabel('Önceki')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⬅️')
            .setDisabled(isFirstPage);

        const nextButton = new ButtonBuilder()
            .setCustomId(nextId)
            .setLabel('Sonraki')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('➡️')
            .setDisabled(isLastPage);

        return new ActionRowBuilder().addComponents(previousButton, nextButton);
    }
}

module.exports = ButtonManager;

// Kullanım örneği:
// const Buttons = require('../helpers/buttonManager');
// interaction.reply({ content: 'Emin misin?', components: [Buttons.createConfirmCancel()] });
