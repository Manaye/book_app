const express = require('express');
const app = express();
const path = require('path');
const superagent = require('superagent');

const pg = require('pg');
require('dotenv').config()
const CONSTRING = process.env.DATABASE_URL
console.log(CONSTRING);
const client = new pg.Client(CONSTRING)
client.connect();


// app.get('/',(req ,res) =>{
//   res.render('index');
// });


const PORT = process.env.PORT||300

app.use(express.urlencoded({extended: true}));



app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/',getBook);



app.post('/searches',createSearch);

app.listen(PORT,function(){
  console.log(`server running at ${PORT}`);
});

function Book(info){
  this.title = info.title;
  this.author = info.author;
  this.isbn = info.isbn;
  this.image_url = info.image_url;
  this.description = info.description;


}
let sampleBooks1 = new Book({title: 'my book', author: 'me', isbn: '5656vhvvjh5765765',image_url: 'some url', description: 'amazing book'});
function addBook(req, res){
  console.log(req.body);
  // let {title, author, isbn, image_url, description} = req.body;
  let {title, author, isbn, image_url, description} = sampleBooks1;

  let sql = 'INSERT INTO booksshelf(title, author, isbn, image_url, description) values ($1, $2, $3, $4, $5);';
  let values = [title, author, isbn, image_url, description];
  return client.query(sql, values).then(res.redirect('/')).catch(err => handleError(err, res));

}
function getBook(req, res){
  let sql = 'SELECT * FROM booksshelf;';
  return client.query(sql).then(results =>{
    console.log(results);
    res.render('pages/index', {results: results.rows});
  });
}

function newSearch(req,res){
  // console.log(req.query );
  res.render('pages/index');
}
function createSearch(req,res){
  // console.log(req.body.search);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (req.body.search[1]==='title'){url += `+intitle:${req.body.search[0]}`;}
  if (req.body.search[1]==='author'){url += `+inauthor:${req.body.search[0]}`;}


  superagent.get(url)
    .then(apiRes=>{
      console.log(apiRes.body.items);

      return apiRes.body.items.map(bookResult=>new Book(bookResult.volumeInfo));


    })
    .then(results=>{
      console.log(results);
      res.render('pages/searches/show',{items: results})
      // res.sendFile(path.join(__dirname,'/public/styles/base.css'));

    }).catch(() => res.render('pages/error'));
}

function handleError(err, res){
  res.render('pages/error');
}
