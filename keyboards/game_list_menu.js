//game_list_menu.js
const game_list_menu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📋 Меню', callback_data: 'open_menu' }, { text: '🔙 Назад', callback_data: 'choose_game' }]
        ]
    }
};

module.exports = { game_list_menu };
