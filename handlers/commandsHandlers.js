const { mainMenu } = require('../keyboards/mainMenu');
const { chooseGameMenu } = require('../keyboards/chooseGame');
const { genresMenu } = require('../keyboards/genres')
const { getGameList, getRandomGame } = require('../database'); // Импорт функции для получения случайной игры

// Обработчик команд
const handleCommands = async (bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userName = msg.from.first_name;

    if (text === '/start') {
        const welcomeMessage = `👋 Привет, ${userName}, я GCSB.  
Я помогу тебе выбрать игру. Давай посмотрим, что я умею!`;
        await bot.sendMessage(chatId, welcomeMessage, mainMenu);
        return;
    }

    if (text === '/menu') {
        return bot.sendMessage(chatId, "📋 Меню", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🎮 Выбрать игру', callback_data: 'choose_game' }, { text: '📖 Команды', callback_data: 'show_commands' }]
                ]
            }
        });
    }

    if (text === '/choose_game') {
        return bot.sendMessage(chatId, "🎮 Выбери действие:", chooseGameMenu);
    }

    if (text === '/show_list') {
        // Получаем список игр из базы данных
        const gameList = await getGameList();
        const message = gameList.length
            ? `📜 Список игр:\n${gameList.join("\n")}` // Форматируем список
            : "📭 В списке пока нет игр."; // Если список пустой

        return bot.sendMessage(chatId, message, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔙 Назад', callback_data: 'open_menu' }] // Кнопка для возврата в меню
                ]
            }
        });
    }

    if (text === '/choose_random_game') {
        // Получаем случайную игру из базы данных
        const randomGame = await getRandomGame();
        const message = randomGame
            ? `🎲 Случайная игра: ${randomGame}` // Если игра найдена
            : "📭 В списке пока нет игр."; // Если игр нет

            return bot.sendMessage(chatId, message, {
                reply_markup:{ 
                    inline_keyboard: 
                    [[{ text: 'Ещё', callback_data: 'choose_random_game' }, 
                    { text: '🔙 Назад', callback_data: 'choose_game' }]]
                }
            });
    }

    if (text === '/choose_by_genre'){
        return bot.sendMessage(chatId, "🎮 Выберите жанр игры:", genresMenu);
    }

    if (text === '/commands') {
        return bot.sendMessage(chatId, `📖 Доступные команды:
        /start - Начало работы с ботом
        /menu - Открыть меню
        /chose_game - Выбрать игру
        /show_list - Показать список игр
        /choose_random_game - Случайная игра
        /choose_by_genre - Выбор игры по жанру
        /commands - Список доступных команд`, mainMenu);
    }

    bot.sendMessage(chatId, "❓ Неизвестная команда.");
};

module.exports = { handleCommands };
