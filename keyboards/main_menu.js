// main_menu.js
const main_menu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '🎮 Выбрать игру', callback_data: 'choose_game' },
             { text: '📁 Списки', callback_data: 'lists' },
             { text: '📖 Команды', callback_data: 'show_commands' }]
        ]
    }
};
module.exports = { main_menu };