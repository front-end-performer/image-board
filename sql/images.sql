DROP TABLE IF EXISTS images CASCADE;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL CHECK(username != ''),
    title VARCHAR(255) NOT NULL CHECK(title != ''),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://media1.giphy.com/media/11l5yJ7snZafM4/giphy.webp?cid=790b7611151770d28cfe487d16879b726cc32d14bc9f0a56&rid=giphy.webp',
    'Bugs Bunny',
    'Super Bunny && Robo Duck',
    'Looney tunes gif'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://media2.giphy.com/media/KJLfHrJbNxl9m/200.webp?cid=790b7611f8242c3bb1f464f2b5afd36a6beb209bcf38493c&rid=200.webp',
    'Bugs Bunny',
    'Bugs Bunny - Apple & Android',
    'Looney tunes gif'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://media3.giphy.com/media/vHOFW51MGcPOo/giphy.webp?cid=790b76110d56b07e548c2768b1b6fed4a0e3667c6fa832c1&rid=giphy.webp',
    'Bugs Bunny',
    'Bugs Bunny tap dance',
    'Looney tunes gif'
);
