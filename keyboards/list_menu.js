//list_menu.js
const list_menu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '➕ Добавить список', callback_data: 'add_list' },
             { text: '📂 Мои списки', callback_data: 'my_lists' }],
             [{ text: '✏️ Редактировать список', callback_data: 'edit_list' },
             { text: '🗑️ Удалить список', callback_data: 'delete_list' }],
             [{ text: '🔙 Назад', callback_data: 'main_menu' }]
        ]
    }
};
module.exports = { list_menu };
