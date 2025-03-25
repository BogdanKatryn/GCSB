//menu.js
const menu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📜 Показать список', callback_data: 'show_list' },
             { text: '🎲 Выбрать случайную игру', callback_data: 'choose_random_game' }],
            [{ text: '🎮 Выбрать по жанру', callback_data: 'choose_by_genre' },
             { text: '📋 Меню', callback_data: 'open_menu' }]
        ]
    }
};

module.exports = { menu };
