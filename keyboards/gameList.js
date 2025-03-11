const gameListMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📋 Меню', callback_data: 'open_menu' }, { text: '🔙 Назад', callback_data: 'choose_game' }]
        ]
    }
};

module.exports = { gameListMenu };
