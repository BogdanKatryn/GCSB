//genres_menu.js
const genres_menu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Sandbox', callback_data: 'sandbox' }, { text: 'RPG', callback_data: 'rpg' }, { text: 'Shooter', callback_data: 'shooter' }],
            [{ text: 'Simulation', callback_data: 'simulation' }, { text: 'Battle Royale', callback_data: 'battle_royale' }, { text: 'Party', callback_data: 'party' }],
            [{ text: 'MOBA', callback_data: 'moba' }, { text: 'Action-Adventure', callback_data: 'action_adventure' }, { text: 'Sports', callback_data: 'sports' }],
            [{ text: 'MMORPG', callback_data: 'mmorpg' }, { text: 'Roguelike', callback_data: 'roguelike' }, { text: 'Horror', callback_data: 'horror' }],
            [{ text: 'Augmented Reality', callback_data: 'augmented_reality' }, { text: 'Platformer', callback_data: 'platformer' }, { text: 'Stealth', callback_data: 'stealth' }],
            [{ text: '🔙 Назад', callback_data: 'choose_game' }]
        ]
    }
};

module.exports = { genres_menu };
