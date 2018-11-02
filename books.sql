
DROP TABLE IF EXISTS books;
    
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    author varchar(255),
    title varchar(255),
    isbn varchar(255),
    image_url varchar(255),
    description TEXT,
    bookshelf varchar(255)
);

INSERT INTO books(author,title,image_url,description)
VALUES ('Daniella steel','going home','https://d3by36x8sj6cra.cloudfront.net/assets/images/book/large/9780/7515/9780751542479.jpg','beautiful love story');