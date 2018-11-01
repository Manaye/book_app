DROP TABLE IF EXISTS bookshelf;

CREATE TABLE bookshelf(
id SERIAL , 
author text [],
title varchar(225),
isbn varchar(225),
image_url varchar(255),
[description]  varchar(255),
bookshelf varchar(255)
);
