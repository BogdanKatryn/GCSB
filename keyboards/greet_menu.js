//greet_menu.js
const greet_menu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📋 Меню', callback_data: 'open_menu' }]  // Новая кнопка "Команды"
        ]
    }
};

module.exports = { greet_menu }