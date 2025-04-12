const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('настроить')
    .setDescription('Настроить автоматическое присвоение ролей по активности'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Настройка отслеживания активности')
      .setDescription('Давайте создадим новую настройку. Следуйте инструкциям.')
      .setColor(0x00AE86);

    await interaction.reply({ embeds: [embed], ephemeral: true });
    // TODO: начать диалог с пользователем — добавим чуть позже
  }
};
