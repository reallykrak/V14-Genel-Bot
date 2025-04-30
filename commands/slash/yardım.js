const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardim')
    .setDescription('Tüm komut kategorilerini gösterir'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Yardım Menüsü')
      .setDescription('Lütfen bir kategori seçin.')
      .setColor('Blurple');

    const menu = new StringSelectMenuBuilder()
      .setCustomId('yardim_menu')
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

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
