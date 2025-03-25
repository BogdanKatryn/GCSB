const { menu } = require('../keyboards/menu');
const { one_more } = require('../keyboards/one_more');
const { list_menu } = require('../keyboards/list_menu');
const { main_menu } = require('../keyboards/main_menu');
const { greet_menu } = require('../keyboards/greet_menu');
const { genres_menu } = require('../keyboards/genres_menu')
const { game_list_menu } = require('../keyboards/game_list_menu');
const { getGameList, getRandomGame, createTable, getUserTables } = require('../database'); // Импорт функции для получения случайной игры

const userStates = {}


// Обработчик команд
const handleCommands = async (bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const userName = msg.from.first_name;

    // Сначала проверяем, ждет ли бот ввода от пользователя
    const userHandled = await handleUserText(bot, msg);
    if (userHandled) return; // Если обработан ввод пользователя, прерываем выполнение

    if (text === '/start') {
        const welcomeMessage = `👋 Привет, ${userName}, я GCSB.\n Я помогу тебе выбрать игру. Давай посмотрим, что я умею!`;
        await bot.sendMessage(chatId, welcomeMessage, greet_menu);
        return;
    }

    if (text === '/menu') {
        return bot.sendMessage(chatId, `📌 Меню возможностей:\n🎮 Выбрать игру - откроет список доступных действий`, main_menu)
    }

    if (text === '/choose_game') {
        return bot.sendMessage(chatId, "🎮 Выбери действие:\n -📜 Показать список\n -🎲 Выбрать случайную игру\n -🎮 Выбрать по жанру\n -📋 Меню", menu);
    }

    if (text === '/show_list') {
        // Получаем список игр из базы данных
        const gameList = await getGameList();
        const message = gameList.length
            ? `📜 Список игр:\n${gameList.join("\n")}` // Форматируем список
            : "📭 В списке пока нет игр."; // Если список пустой

        return bot.sendMessage(chatId, message, game_list_menu)
    }

    if (text === '/choose_random_game') {
        // Получаем случайную игру из базы данных
        const randomGame = await getRandomGame();
        const message = randomGame
            ? `🎲 Случайная игра: ${randomGame}` // Если игра найдена
            : "📭 В списке пока нет игр."; // Если игр нет

            return bot.sendMessage(chatId, message, one_more)
        }

    if (text === '/choose_by_genre'){
        return bot.sendMessage(chatId, "🎮 Выберите жанр игры:", genres_menu);
    }

    if (text === '/list') {
        return bot.sendMessage(chatId, 
            `📂 Выберите действие с вашими списками:
            ➕ Добавить список
            📂 Мои списки
            ✏️ Редактировать список
            🗑️ Удалить список
            🔙 Назад` , list_menu);
    }

    if (text === '/commands') {
        return bot.sendMessage(chatId, `📖 Доступные команды:
        /start - Начало работы с ботом
        /menu - Открыть меню
        /choose_game - Выбрать игру
        /show_list - Показать список игр
        /choose_random_game - Случайная игра
        /choose_by_genre - Выбор игры по жанру
        /list - Списки
        /add_list - Добавить новый список
        /my_lists - Посмотреть все списки
        /commands - Список доступных команд`, greet_menu);
    }

    if (text === '/add_list'){
        userStates[chatId] = 'waiting_for_list_name'; // Устанавливаем состояние
        return bot.sendMessage(chatId, '📂 Назовите список:');
    }
    
    if (text === '/my_lists') {
        try {
            const tableList = await getUserTables(chatId); // Получаем список таблиц для текущего пользователя
            const message = tableList.length
                ? `📂 Список ваших таблиц:\n${tableList.join("\n")}` // Если есть таблицы, показываем их
                : "📭 У вас нет собственных списков."; // Если нет таблиц, выводим сообщение

            // Отправляем сообщение с кнопками (list_menu) если нужно
            return bot.sendMessage(chatId, message, list_menu); 
        } catch (error) {
            // В случае ошибки отправляем сообщение о проблеме
            return bot.sendMessage(chatId, '❌ Ошибка при получении списка таблиц.');
        }
    }

    bot.sendMessage(chatId, "❓ Неизвестная команда.");
};
const handleUserText = async (bot, msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;
  
    if (userStates[chatId] === 'waiting_for_list_name') {
      if (!userInput.trim()) {
        return bot.sendMessage(chatId, '❌ Название списка не может быть пустым. Попробуйте снова:');
      }
  
      try {
        await createTable(chatId, userInput); // Создаем таблицу через database.js
        await bot.sendMessage(chatId, `✅ Список "${userInput}" успешно создан!`);
      } catch (error) {
        await bot.sendMessage(chatId, '❌ Ошибка при создании списка. Попробуйте другое название.');
      }
  
      delete userStates[chatId]; // Сбрасываем состояние пользователя
      return true; // Возвращаем true, чтобы остановить дальнейшую обработку
    }
    return false; // Возвращаем false, если пользователь не в состоянии ввода
};
module.exports = { handleCommands };
