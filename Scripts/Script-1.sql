COPY base_list_games (name, genre)
FROM 'E:\Project\GCSB\games.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');
