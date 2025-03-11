const {getGamesByGenre} = require('../database');

// 🔹 Словарь с настройками жанров
const genres = {
    sandbox: { name: "Sandbox", callbackPrefix: "sandbox" },
    rpg: { name: "RPG", callbackPrefix: "rpg" },
    shooter: { name: "Shooter", callbackPrefix: "shooter" },
    simulation: {name: "Simulation", callbackPrefix: "simulation"},
    battle_royale: {name: "Battle Royale", callbackPrefix: "battle_royale"},
    party: {name: "Party", callbackPrefix: "party"},
    moba: {name: "MOBA", callbackPrefix: "moba"},
    action_adventure: {name: "Action-Adventure", callbackPrefix: "action_adventure"},
    sports: {name: "Sports", callbackPrefix: "sports"},
    mmorpg: {name: "MMORPG", callbackPrefix: "mmorpg"},
    roguelike: {name: "Roguelike", callbackPrefix: "roguelike"},
    horror: {name: "Horror", callbackPrefix: "horror"},
    augmented_reality: {name: "Augmented Reality", callbackPrefix: "augmented_reality"},
    platformer: {name: "Platformer", callbackPrefix: "platformer"},
    stealth: {name: "Stealth", callbackPrefix: "stealth"}
};

// 🔹 Функция обработки выбора жанра
async function handleGenreSelection(bot, chatId, genreKey) {
    const genre = genres[genreKey];
    if (!genre) return;

    const games = await getGamesByGenre(genre.name);
    const message = games.length
        ? "Показать весь список или Выбрать случайно?"
        : `📭 В жанре '${genre.name}' пока нет игр.`;

    return bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📜Показать список', callback_data: `show_list_${genreKey}` },
                 { text: '🎮Выбрать случайно', callback_data: `choose_random_${genreKey}` },
                 { text: '🔙 Назад', callback_data: 'choose_by_genre' }]
            ]
        }
    });
}

// 🔹 Функция обработки "Показать список"
async function handleShowList(bot, chatId, genreKey) {
    const genre = genres[genreKey];
    if (!genre) return;

    const games = await getGamesByGenre(genre.name);
    const message = games.length
        ? `📜 Игры в жанре "${genre.name}":\n${games.join("\n")}`
        : `📭 В жанре '${genre.name}' пока нет игр.`;

    return bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Назад', callback_data: genreKey }]
            ]
        }
    });
}

// 🔹 Функция случайного выбора игры
async function handleRandomGame(bot, chatId, genreKey) {
    const genre = genres[genreKey];
    if (!genre) return;

    const games = await getGamesByGenre(genre.name);
    if (!games.length) return bot.sendMessage(chatId, `📭 В жанре '${genre.name}' пока нет игр.`);

    const randomGame = games[Math.floor(Math.random() * games.length)];
    return bot.sendMessage(chatId, `🎲 Случайная игра в жанре "${genre.name}": ${randomGame}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Ещё', callback_data: `choose_random_${genreKey}` },
                 { text: '🔙 Назад', callback_data: genreKey }]
            ]
        }
    });
}

module.exports = { handleGenreSelection, handleShowList, handleRandomGame, genres };
