const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Настроить начальные параметры бота'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Начальная настройка')
      .setDescription('Бот успешно активирован. Теперь вы можете использовать команды.')
      .setColor(0x00AE86);

    await interaction.reply({ embeds: [embed], ephemeral: true });

    // Здесь можно добавить начальную инициализацию, сохранение конфигов и т.д.
  }
};
