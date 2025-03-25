//one_more.js
const one_more = {
    reply_markup:{ 
        inline_keyboard: 
        [[{ text: 'Ещё', callback_data: 'choose_random_game' }, 
        { text: '🔙 Назад', callback_data: 'choose_game' }]]
    }
};

module.exports = {one_more}