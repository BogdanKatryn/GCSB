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

const getRandomGame = async () => {
  try {
    const res_1 = await client.query('SELECT name FROM base_list_games ORDER BY RANDOM() LIMIT 1');
    return res_1.rows[0] ? res_1.rows[0].name : null;
  } catch (err) {
    console.error('Ошибка при получении случайной игры:', err.stack);
    return null;
  }
};

const getGenres = async () => {
  try {
    const res_2 = await client.query('SELECT genre FROM base_list_games'); // Запрос к базе данных для получения жанров
    return res_2.rows.map(row => row.genre); // Возвращаем список жанров
  } catch (err) {
    console.error('Ошибка при получении жанров:', err.stack);
    return [];
  }
};

module.exports = { getGameList, getRandomGame, getGenres };
