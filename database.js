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

// Функция для получения случайной игры
const getRandomGame = async () => {
  try {
    const res_1 = await client.query('SELECT name FROM base_list_games ORDER BY RANDOM() LIMIT 1');
    return res_1.rows[0] ? res_1.rows[0].name : null;
  } catch (err) {
    console.error('Ошибка при получении случайной игры:', err.stack);
    return null;
  }
};

// Функция для получения жанров
const getGenres = async () => {
  try {
    const res_2 = await client.query('SELECT genre FROM base_list_games'); // Запрос к базе данных для получения жанров
    return res_2.rows.map(row => row.genre); // Возвращаем список жанров
  } catch (err) {
    console.error('Ошибка при получении жанров:', err.stack);
    return [];
  }
};

// Функция для получения игр по жанру
const getGamesByGenre = async (genre) => {
  try {
    const res = await client.query('SELECT name FROM base_list_games WHERE genre = $1', [genre]);
    return res.rows.map(row => row.name); // Возвращаем список игр для данного жанра
  } catch (err) {
    console.error('Ошибка при получении игр по жанру:', err.stack);
    return [];
  }
};

const createTable = async (chatId, tableName) => {
  const sanitizedTableName = tableName.toLowerCase(); // Санитизация имени таблицы
  const query = `
    CREATE TABLE IF NOT EXISTS "${sanitizedTableName}" (
      id SERIAL PRIMARY KEY,
      game_name TEXT NOT NULL,
      genre TEXT,
      sort_order INTEGER DEFAULT 0,
      user_id TEXT NOT NULL
    )
  `;
  
  await client.query(query);

  // Добавляем пользователя как владельца в таблицу
  const insertOwnerQuery = `
    INSERT INTO "${sanitizedTableName}" (game_name, genre, user_id) 
    VALUES ('OWNER', 'ADMIN', $1)
  `;
  await client.query(insertOwnerQuery, [chatId]);

  // Логируем, что таблица создана и пользователь добавлен
  console.log(`Таблица "${sanitizedTableName}" создана для пользователя ${chatId}`);
};


const getUserTables = async (chatId) => {
  try {
    // Получаем список всех таблиц в схеме public
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    let userTables = [];

    for (let row of res.rows) {
      // Проверяем, есть ли столбец user_id в таблице
      const columnCheckQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
      `;
      const columnCheckRes = await client.query(columnCheckQuery, [row.table_name]);

      // Если столбец user_id существует в таблице
      const hasUserIdColumn = columnCheckRes.rows.some(column => column.column_name === 'user_id');
      
      if (hasUserIdColumn) {
        // Проверяем наличие записи с user_id в таблице
        const checkUserQuery = `
          SELECT 1 FROM public."${row.table_name}" WHERE user_id = $1 LIMIT 1
        `;
        const checkUserRes = await client.query(checkUserQuery, [chatId]);

        if (checkUserRes.rows.length > 0) {
          userTables.push(row.table_name);
        }
      }
    }

    return userTables.length > 0 ? userTables : [];
  } catch (err) {
    console.error('Ошибка при получении таблиц для пользователя:', err.stack);
    return [];
  }
};





// Функция для получения списка таблиц
const getTableList = async () => {
  try {
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
    return res.rows.map(row => row.table_name);
  } catch (err) {
    throw new Error('Ошибка при получении списка таблиц: ' + err.message);
  }
};

module.exports = {getGameList, getRandomGame, getGenres, getGamesByGenre, createTable, getUserTables, getTableList };
