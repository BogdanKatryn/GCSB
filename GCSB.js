const TelegramBot = require('node-telegram-bot-api'); 
const dotenv = require('dotenv'); 
const { getGameList } = require('./database.js'); 

dotenv.config(); 
const token = process.env.TOKEN; 
const bot = new TelegramBot(token, { polling: true }); 

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: "Приветствие" },
        { command: '/info', description: "Информация о боте" },
        { command: '/list', description: "Просмотреть список игр" },
        { command: '/random', description: "Выбрать случайную игру" },
        { command: '/help', description: "Список доступных команд" }
    ]);

    bot.on('message', async msg => {
        const chatId = msg.chat.id;
        const text = msg.text;
        const userName = msg.from.first_name;

        const menu = {
            reply_markup: {
                inline_keyboard: [
                    [{ text:'About Bot', callback_data: 'about_bot'}],
                    // [{ text: 'Menu', callback_data: 'menu' }]
                ]
            }
        };

        // Команда /start
        if (text === '/start') {
            return bot.sendMessage(chatId, `👋 Привет, ${userName}!\nЭтот бот поможет тебе выбрать игру.`, menu);
        }

        // Команда /info
        if (text === '/info') {
            return bot.sendMessage(chatId, "🎮 Этот бот помогает выбрать игру.\nТы можешь просмотреть список игр или выбрать случайную.");
        }

        // Команда /list
        if (text === '/list') {
            const gameList = await getGameList();
            if (gameList.length === 0) {
                return bot.sendMessage(chatId, "📭 В списке пока нет игр.");
            }
            const messageText = "📜 Список игр:\n" + gameList.map((game, index) => `${index + 1}. ${game}`).join("\n");
            return bot.sendMessage(chatId, messageText);
        }

        // Команда /random
        if (text === '/random') {
            const gameList = await getGameList();
            if (gameList.length === 0) {
                return bot.sendMessage(chatId, "😢 В списке нет игр для выбора.");
            }
            const randomGame = gameList[Math.floor(Math.random() * gameList.length)];
            return bot.sendMessage(chatId, `🎲 Тебе стоит сыграть в: ${randomGame}`);
        }

        // Команда /help
        if (text === '/help') {
            return bot.sendMessage(chatId, "📖 Доступные команды:\n" +
                "/start - Приветствие\n" +
                "/info - Информация о боте\n" +
                "/list - Просмотреть список игр\n" +
                "/random - Выбрать случайную игру\n" +
                "/help - Список команд"
            );
        }

        return bot.sendMessage(chatId, "❓ Неизвестная команда. Напиши /help, чтобы увидеть список доступных команд.");
    });

    // Обработчик нажатия кнопки "ℹ️ Информация"
    bot.on('callback_query', query => {
        const chatId = query.message.chat.id;
        if (query.data === 'about_bot') {
            bot.sendMessage(chatId, "🎮 Этот бот помогает выбрать игру.\nТы можешь просмотреть список игр или выбрать случайную.");
        }
        // if (query.data === 'menu'){
        //     bot.sendMessage(chatId, "")
        // }
        bot.answerCallbackQuery(query.id);
    });
};

start();
