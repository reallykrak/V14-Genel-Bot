const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'yardım',
  description: 'Tüm komut kategorilerini gösterir',
  execute: async (message) => {
    const embed = new EmbedBuilder()
      .setTitle('Yardım Menüsü')
      .setDescription('Aşağıdaki menüden bir kategori seçin.')
      .setColor('Blurple');

    const menu = new StringSelectMenuBuilder()
      .setCustomId('yardim_menu_prefix')
      .setPlaceholder('Bir kategori seçin')
      .addOptions([
        {
          label: 'Ekonomi',
          value: 'ekonomi',
          description: 'Ekonomi ile ilgili komutları gösterir',
        },
        {
          label: 'Moderasyon',
          value: 'moderasyon',
          description: 'Moderasyon komutlarını gösterir',
        },
        {
          label: 'Ticket',
          value: 'ticket',
          description: 'Destek sistemi komutlarını gösterir',
        },
        {
          label: 'Genel',
          value: 'genel',
          description: 'Diğer genel komutları gösterir',
        },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await message.channel.send({ embeds: [embed], components: [row] });
  },
};
