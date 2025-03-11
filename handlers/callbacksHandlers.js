const { chooseGameMenu } = require('../keyboards/chooseGame');
const { gameListMenu } = require('../keyboards/gameList');
const { genresMenu } = require('../keyboards/genres');
const { getGameList, getRandomGame, getGamesByGenre } = require('../database');
const { mainMenu } = require('../keyboards/mainMenu');

const handleCallbacks = async (bot, query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Открыть меню
    if (data === 'open_menu') {
        const menuMessage = `📌 Меню возможностей:
🎮 Выбрать игру - откроет список доступных действий`;

        return bot.sendMessage(chatId, menuMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎮 Выбрать игру', callback_data: 'choose_game' },
                    { text: '📖 Команды', callback_data: 'show_commands' }]
                ]
            }
        });
    }

    // Выбрать игру
    if (data === 'choose_game') {
        return bot.sendMessage(chatId, "🎮 Выбери действие:\n -📜 Показать список\n -🎲 Выбрать случайную игру\n -🎮 Выбрать по жанру\n -📋 Меню", chooseGameMenu);
    }

    // Показать список игр
    if (data === 'show_list') {
        const gameList = await getGameList();
        const message = gameList.length ? `📜 Список игр:\n${gameList.join("\n")}` : "📭 В списке пока нет игр.";
        return bot.sendMessage(chatId, message, gameListMenu);
    }

    // Выбрать случайную игру
    if (data === 'choose_random_game') {
        const randomGame = await getRandomGame();
        const message = randomGame ? `🎲 Случайная игра: ${randomGame}` : "📭 В списке пока нет игр.";
        return bot.sendMessage(chatId, message, {
            reply_markup: { inline_keyboard: [[{ text: 'Ещё', callback_data: 'choose_random_game' }, { text: '🔙 Назад', callback_data: 'choose_game' }]] }
        });
    }

    // Выбор игры по жанру
    if (data === 'choose_by_genre') {
        return bot.sendMessage(chatId, "🎮 Выберите жанр игры:", genresMenu);
    }    

    // Обработчик для показа списка команд
    if (data === 'show_commands') {
        const commandsMessage = `📖 Доступные команды:
        /start - Начало работы с ботом
        /menu - Открыть меню
        /show_list - Показать список игр
        /choose_game - Выбрать игру
        /choose_random_game - Случайная игра
        /choose_by_genre - Выбор игры по жанру
        /commands - Список доступных команд`;

        return bot.sendMessage(chatId, commandsMessage, mainMenu);
    }

    bot.answerCallbackQuery(query.id);
};

module.exports = { handleCallbacks };
