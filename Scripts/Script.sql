CREATE TABLE IF NOT EXISTS base_list_games (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    genre TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);
