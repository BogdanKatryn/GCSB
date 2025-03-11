// mainMenu.js
module.exports.mainMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📋 Меню', callback_data: 'open_menu' }]  // Новая кнопка "Команды"
        ]
    }
};
