const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { handleCommands } = require('./handlers/commandsHandlers');
const { handleCallbacks } = require('./handlers/callbacksHandlers');
const { getGamesByGenre } = require('./database');
const { handleGenreSelection, handleShowList, handleRandomGame, genres } = require('./handlers/genreHandlers');

dotenv.config();
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Устанавливаем доступные команды для бота
bot.setMyCommands([
    { command: '/start', description: "Запуск бота" },
    { command: '/menu', description: "Меню" },
    { command: '/show_list', description: "Показать список игр по умолчанию" },
    { command: '/choose_game', description: "Выбрать игру" },
    { command: '/choose_random_game', description: "Показать список игр по умолчанию" },
    { command: '/choose_by_genre', description: "Выбрать игры за жанром" },
    { command: '/commands', description: "Список доступных команд" }
]);

bot.on('callback_query', async (query) => {
    const { data, message } = query;
    const chatId = message.chat.id;

    // Проверяем, является ли callback жанром
    if (genres[data]) {
        return handleGenreSelection(bot, chatId, data);
    }

    // Проверяем, является ли callback "Показать список"
    if (data.startsWith('show_list_')) {
        const genreKey = data.replace('show_list_', '');
        return handleShowList(bot, chatId, genreKey);
    }

    // Проверяем, является ли callback "Случайная игра"
    if (data.startsWith('choose_random_')) {
        const genreKey = data.replace('choose_random_', '');
        return handleRandomGame(bot, chatId, genreKey);
    }
});

// Обработчик команд
bot.on('message', (msg) => handleCommands(bot, msg));

// Обработчик коллбеков
bot.on('callback_query', (query) => handleCallbacks(bot, query));

console.log('✅ Бот запущен!');
