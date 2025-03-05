const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const { getGameList, getRandomGame } = require('./database.js'); // Подключаем getGenres

dotenv.config();
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Главное меню
const gameMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '🎮 Выбрать игру', callback_data: 'choose_game' }]
        ]
    }
};

// Меню для выбора игры
const chooseGameMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📜 Показать список', callback_data: 'show_list' }],
            [{ text: '🎲 Выбрать случайную игру', callback_data: 'choose_random_game' }],
            [{ text: '🎮 Выбрать по жанру', callback_data: 'choose_by_genre' }]
        ]
    }
};

// Меню для списка игр
const gameListMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📋 Меню', callback_data: 'open_menu' },
            { text: '🔙 Назад', callback_data: 'back_to_choose_game' }]
        ]
    }
};

// Меню для выбора жанра
const showChooseGenreMenu = async (chatId) => {
    // Создание инлайн-клавиатуры с жанрами
    await bot.sendMessage(chatId, '🎮 Выберите жанр игры:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Sandbox', callback_data: 'sandbox' },
                    { text: 'RPG', callback_data: 'rpg' },
                    { text: 'Shooter', callback_data: 'shooter' }
                ],
                [
                    { text: 'Simulation', callback_data: 'simulation' },
                    { text: 'Battle Royale', callback_data: 'battle_royale' },
                    { text: 'Party', callback_data: 'party' }
                ],
                [
                    { text: 'MOBA', callback_data: 'moba' },
                    { text: 'Action-Adventure', callback_data: 'action_-_adventure' },
                    { text: 'Sports', callback_data: 'sports' }
                ],
                [
                    { text: 'MMORPG', callback_data: 'mmorpg' },
                    { text: 'Roguelike', callback_data: 'roguelike' },
                    { text: 'Horror', callback_data: 'horror' }
                ],
                [
                    { text: 'Augmented Reality', callback_data: 'augmented_reality' },
                    { text: 'Platformer', callback_data: 'platformer' },
                    { text: 'Stealth', callback_data: 'stealth' }
                ]
            ]
        }
    });
};

// Функция показа меню
const showMenu = async (chatId) => {
    await bot.sendMessage(chatId,
        `📌 *Меню возможностей:*
🎮 *Выбрать игру* - откроет список доступных действий `,
        { parse_mode: 'Markdown' });

    return bot.sendMessage(chatId, "📋 Меню", gameMenu);
};

// Функция показа меню выбора игры
const showChooseGameMenu = async (chatId) => {
    return bot.sendMessage(chatId, "🎮 Выбери действие:", chooseGameMenu);
};

// Функция показа списка игр
const showGameList = async (chatId) => {
    const gameList = await getGameList();
    if (gameList.length === 0) {
        return bot.sendMessage(chatId, "📭 В списке пока нет игр.");
    }

    // Здесь можно добавить сортировку
    gameList.sort();

    await bot.sendMessage(chatId, "📜 Список игр:\n" + gameList.join("\n"), gameListMenu);
};

// Функция для выбора случайной игры
const chooseRandomGame = async (chatId) => {
    const randomGame = await getRandomGame();
    if (!randomGame) {
        return bot.sendMessage(chatId, "📭 В списке пока нет игр.");
    }

    return bot.sendMessage(chatId, `🎲 Случайная игра: ${randomGame}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Ещё', callback_data: 'choose_random_game' },        // Кнопка "Ещё" для новой случайной игры
                { text: '🔙 Назад', callback_data: 'back_to_choose_game' }]  // Кнопка "Назад" для возврата в предыдущее меню
            ]
        }
    });
};

// Функция старта бота
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: "Запуск бота" },
        { command: '/menu', description: "Меню" },
        { command: '/chose_game', description: "Выбрать игру" },
        { command: '/commands', description: "Список доступных команд" }
    ]);

    bot.on('message', async msg => {
        const chatId = msg.chat.id;
        const text = msg.text;
        const userName = msg.from.first_name;

        if (text === '/start') {
            // Приветственное сообщение с кнопкой меню
            const welcomeMessage = `👋 Привет, ${userName}, я GCSB.  
Я создан для того, чтобы помочь тебе определиться с выбором игр.  
Давай посмотрим в меню, что я умею!`;

            // Выводим приветствие с кнопкой "Меню"
            await bot.sendMessage(chatId, welcomeMessage, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📋 Меню', callback_data: 'open_menu' }]
                    ]
                }
            });

            // Не показываем меню сразу, только после нажатия на кнопку "Меню"
            return;
        }

        if (text === '/menu') {
            return showMenu(chatId);
        }

        if (text === '/chose_game') {
            return showChooseGameMenu(chatId); // Показываем меню выбора игры
        }

        if (text === '/commands') {
            return bot.sendMessage(chatId, "📖 Доступные команды:\n" +
                "/start - Запуск бота\n" +
                "/menu - Меню\n" +
                "/chose_game - Выбрать игру\n" +
                "/commands - Список команд");
        }

        return bot.sendMessage(chatId, "❓ Неизвестная команда. Используй /help для списка доступных команд.");
    });

    // Обработчик нажатий кнопок
    bot.on('callback_query', async query => {
        const chatId = query.message.chat.id;
        const data = query.data;

        if (data === 'open_menu') {
            return showMenu(chatId); // Показываем меню, когда нажата кнопка "Меню"
        }

        if (data === 'choose_game') {
            return showChooseGameMenu(chatId); // Показываем меню выбора игры
        }

        if (data === 'show_list') {
            return showGameList(chatId); // Показываем список игр
        }

        if (data === 'choose_random_game') {
            return chooseRandomGame(chatId); // Показываем случайную игру
        }

        if (data === 'back_to_choose_game') {
            return showChooseGameMenu(chatId); // Возвращаем в меню выбора игры
        }

        // Обработка кнопки "Выбрать жанр игры"
        if (data === 'choose_by_genre') {
            return showChooseGenreMenu(chatId); // Показываем меню выбора жанра
        }

        bot.answerCallbackQuery(query.id);
    });
};

start();
