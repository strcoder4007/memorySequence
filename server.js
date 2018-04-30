const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const app = express();


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    var pageToVisit = "https://jordanbpeterson.com/reading-list/great-books/";
    console.log("Visiting page " + pageToVisit);
    request(pageToVisit, function(error, response, body) {
        var books = [];
       if(error) {
         console.log("Error: " + error);
       }
       if(response.statusCode === 200) {
         var $ = cheerio.load(body);
         $('.fusion-text ol li').each(function(i, elem) {
             books.push({
                 "book": $(this).text()
             })
         });
         res.send(books);
       }
    });
})


app.listen(3000, () => console.log('Listening on port 3000...'))