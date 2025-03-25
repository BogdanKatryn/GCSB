const { menu } = require('../keyboards/menu');
const { one_more } = require('../keyboards/one_more');
const { list_menu } = require('../keyboards/list_menu');
const { main_menu } = require('../keyboards/main_menu');
const { greet_menu } = require('../keyboards/greet_menu')
const { genres_menu } = require('../keyboards/genres_menu');
const { game_list_menu } = require('../keyboards/game_list_menu');
const { getGameList, getRandomGame, createTable, getUserTables} = require('../database');

const userStates = {}; // Хранит состояние пользователя

const handleCallbacks = async (bot, query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Открыть меню
    if (data === 'open_menu') {
        const menu_message = `📌 Меню возможностей:\n🎮 Выбрать игру - откроет список доступных действий \n 📁 Списки - Управление вашими списками игр`;
        return bot.sendMessage(chatId, menu_message, main_menu)
    }

    if (data === 'main_menu'){
        const menu_message = `📌 Меню возможностей:\n🎮 Выбрать игру - откроет список доступных действий \n 📁 Списки - Управление вашими списками игр`;
        return bot.sendMessage(chatId, menu_message,  main_menu)
    }

    // Выбрать игру
    if (data === 'choose_game') {
        return bot.sendMessage(chatId, "🎮 Выбери действие:\n -📜 Показать список\n -🎲 Выбрать случайную игру\n -🎮 Выбрать по жанру\n -📋 Меню", menu);
    }

    if (data === 'lists') {
        return bot.sendMessage(chatId, 
        `📂 Выберите действие с вашими списками:
        ➕ Добавить список
        📂 Мои списки
        ✏️ Редактировать список
        🗑️ Удалить список
        🔙 Назад` , list_menu);
    }

    // Показать список игр
    if (data === 'show_list') {
        const gameList = await getGameList();
        const message = gameList.length ? `📜 Список игр:\n${gameList.join("\n")}` : "📭 В списке пока нет игр.";
        return bot.sendMessage(chatId, message, game_list_menu);
    }

    // Выбрать случайную игру
    if (data === 'choose_random_game') {
        const randomGame = await getRandomGame();
        const message = randomGame ? `🎲 Случайная игра: ${randomGame}` : "📭 В списке пока нет игр.";
        return bot.sendMessage(chatId, message, one_more)
    }

    // Выбор игры по жанру
    if (data === 'choose_by_genre') {
        return bot.sendMessage(chatId, "🎮 Выберите жанр игры:", genres_menu);
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
        /list - Списки
        /add_list - Добавить новый список
        /my_lists - Посмотреть все списки
        /commands - Список доступных команд`;

        return bot.sendMessage(chatId, commandsMessage, greet_menu);
    }

    if (data === 'add_list') {
        userStates[chatId] = 'waiting_for_list_name'; // Устанавливаем состояние
        return bot.sendMessage(chatId, '📂 Назовите список:');
    }

    // Показать список таблиц (списки)
    if (data === 'my_lists') {
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

    // Отправка ответа на клик по кнопке (обработка запроса)
    bot.answerCallbackQuery(query.id);

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
  

module.exports = { handleCallbacks, handleUserText };
