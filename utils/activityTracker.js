const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../data/activity.db'));

module.exports = (client) => {
  // Создание таблиц, если не существует
  db.run(`CREATE TABLE IF NOT EXISTS activity (
    userId TEXT,
    guildId TEXT,
    messageCount INTEGER DEFAULT 0,
    voiceTime INTEGER DEFAULT 0,
    lastUpdate INTEGER
  )`);

  client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const now = Date.now();
    db.run(`
      INSERT INTO activity(userId, guildId, messageCount, voiceTime, lastUpdate)
      VALUES (?, ?, 1, 0, ?)
      ON CONFLICT(userId, guildId)
      DO UPDATE SET messageCount = messageCount + 1, lastUpdate = ?
    `, [message.author.id, message.guild.id, now, now]);
  });

  // Голосовой онлайн
  client.on('voiceStateUpdate', (oldState, newState) => {
    const userId = newState.id;
    const guildId = newState.guild.id;

    if (!oldState.channel && newState.channel) {
      // Пользователь зашел в войс — запоминаем время входа
      newState.member.voiceStart = Date.now();
    }

    if (oldState.channel && !newState.channel && newState.member.voiceStart) {
      // Пользователь вышел — сохраняем время
      const timeSpent = Date.now() - newState.member.voiceStart;

      db.run(`
        INSERT INTO activity(userId, guildId, messageCount, voiceTime, lastUpdate)
        VALUES (?, ?, 0, ?, ?)
        ON CONFLICT(userId, guildId)
        DO UPDATE SET voiceTime = voiceTime + ?, lastUpdate = ?
      `, [userId, guildId, timeSpent, Date.now(), timeSpent, Date.now()]);
    }
  });
};