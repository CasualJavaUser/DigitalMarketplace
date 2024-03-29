DROP TABLE IF EXISTS game_store_db.`purchase`;
DROP TABLE IF EXISTS game_store_db.`key`;
DROP TABLE IF EXISTS game_store_db.`offer`;
DROP TABLE IF EXISTS game_store_db.`customer`;
DROP TABLE IF EXISTS game_store_db.`employee`;
DROP TABLE IF EXISTS game_store_db.`user`;

CREATE TABLE game_store_db.`user`
(
    `id`       int          NOT NULL AUTO_INCREMENT,
    `name`     varchar(50)  NOT NULL,
    `email`    varchar(254) NOT NULL,
    `password` varchar(50)  NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`email`)
);

CREATE TABLE game_store_db.`employee`
(
    `id`      int         NOT NULL,
    `surname` varchar(50) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`id`) REFERENCES `user` (`id`)
);

CREATE TABLE game_store_db.`customer`
(
    `id` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`id`) REFERENCES `user` (`id`)
);

CREATE TABLE game_store_db.`offer`
(
    `id`           int           NOT NULL AUTO_INCREMENT,
    `seller_id`    int           NOT NULL,
    `title`        varchar(100)  NOT NULL,
    `developer`    varchar(100) DEFAULT NULL,
    `publisher`    varchar(100) DEFAULT NULL,
    `release_date` date         DEFAULT NULL,
    `price_usd`    decimal(6, 2) NOT NULL,
    `discount`     decimal(3, 2) NOT NULL,
    `image_url`    varchar(200)  NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `customer` (`id`)
);

CREATE TABLE game_store_db.`key`
(
    `code`     varchar(29) NOT NULL,
    `offer_id` int         NOT NULL,
    PRIMARY KEY (`code`),
    FOREIGN KEY (`offer_id`) REFERENCES `offer` (`id`)
);

CREATE TABLE game_store_db.`purchase`
(
    `id`             int           NOT NULL AUTO_INCREMENT,
    `key`            varchar(29)   NOT NULL,
    `buyer_id`       int           NOT NULL,
    `purchase_time`  datetime      NOT NULL,
    `purchase_price` decimal(6, 2) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`key`),
    FOREIGN KEY (`buyer_id`) REFERENCES `customer` (`id`)
);

insert into game_store_db.`user` (id, name, email, password)
values (1, 'maks', 'mb@gmail.com', '123'),
       (2, 'jan', 'jan@gmail.com', '123'),
       (3, 'maciek', 'maciek@wp.com', '321'),
       (4, 'Marcin', 'marcin@maxgames.com', '321'),
       (5, 'Kacper', 'kacper@maxgames.com', '321');

insert into game_store_db.customer (id)
values (1),
       (2),
       (3);

insert into game_store_db.employee (id, surname)
values (4, 'Nowak'),
       (5, 'Wiśniewski');

insert into game_store_db.offer (id, seller_id, title, developer, publisher, release_date, price_usd, discount,
                                 image_url)
values (1, 1, 'Portal 2', 'Valve', 'Valve', '2011-04-19', 9.99, 0.00,
        'https://assetsio.reedpopcdn.com/co1rs4.jpg?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp'),
       (2, 2, 'CS2', 'Valve', 'Valve', '2023-01-01', 9.99, 0.50,
        'https://static.wikia.nocookie.net/cswikia/images/3/37/Cs2_boxart.jpg/'),
       (3, 1, 'Half-Life 2', 'Valve', 'Valve', '2004-11-16', 9.99, 0.00,
        'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Half-Life_2_cover.jpg/220px-Half-Life_2_cover.jpg'),
       (4, 3, 'Project Zomboid', 'The Indie Stone', 'The Indie Stone', '2013-11-8', 19.99, 0.20,
        'https://upload.wikimedia.org/wikipedia/en/0/0c/Boxshot_of_video_game_Project_zomboid.jpg');

insert into game_store_db.key (code, offer_id)
values ('AAAAA-BBBBB-CCCCC', 1),
       ('DDDDD-EEEEE-FFFFF', 1),
       ('GGGGG-HHHHH-IIIII', 2),
       ('JJJJJ-KKKKK-LLLLL', 2),
       ('MMMMM-NNNNN-OOOOO', 3),
       ('PPPPP-RRRRR-SSSSS', 3),
       ('TTTTT-UUUUU-WWWWW', 4);

insert into game_store_db.purchase (`key`, buyer_id, purchase_time, purchase_price)
values ('AAAAA-BBBBB-CCCCC', 2, '2024-01-08 23:21:00', 9.99),
        ('GGGGG-HHHHH-IIIII', 1, '2023-12-09 18:13:00', 9.99),
        ('MMMMM-NNNNN-OOOOO', 3, '2023-12-20 19:15:00', 9.99),
        ('PPPPP-RRRRR-SSSSS', 1, '2024-01-02 14:51:00', 5.00);