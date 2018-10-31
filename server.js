const express = require('express');
const app = express();
const path = require('path');
const superagent = require('superagent');
const bodyParser = require('body-parser');

//const pg = require('pg');
require('dotenv').config()


const PORT = process.env.PORT||300
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',newSearch);


app.post('/searches',createSearch);

app.listen(PORT,function(){
  console.log(`server running at ${PORT}`);
});

function Book(info){
  this.title = info.title;
  this.publisher = info.publisher;
  this.publishedDate = info.publishedDate;
  this.description = info.description;

}

// /const  all book = apires .body .item.slice(0,10)

function newSearch (req,res){
  // console.log(req.query );
  res.render('pages/index.ejs');
}
function createSearch(req,res){
  // console.log(req.body.search);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (req.body.search[1]==='title'){url += `+intitle:${req.body.search[0]}`;}
  if (req.body.search[1]==='author'){url += `+inauthor:${req.body.search[0]}`;}

  

  superagent.get(url)
    .then(apiRes=>{
      console.log(apiRes.body.items);
      return apiRes.body.items.map(bookResult=> new Book(bookResult.volumeInfo))})
    .then(results=>{
      console.log(results);
      res.render('pages/searches/show',{items: results})
      res.sendFile(path.join(__dirname,'/public/styles/base.css'));

    }).catch(() => res.render('pages/error'));
}

// let SQL ='Select * from books WHERE id=$1;';
// let values =[ Request.query.book_id];

// return clientInformation.query(SQL,values)
// .then(result=> response.render('pages/detailview',result))
