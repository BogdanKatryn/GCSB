const { Client } = require('pg');

// Настройка базы данных
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'GCSB',
  password: '0000',
  port: 5432,
});

client.connect();

// Функция для получения списка игр
const getGameList = async () => {
  try {
    const res = await client.query('SELECT name FROM base_list_games'); // Запрос к базе данных
    return res.rows.map(row => row.name);
  } catch (err) {
    console.error('Ошибка при получении данных:', err.stack);
    return [];
  }
};

// Экспортируем правильно
module.exports = { getGameList };
