var http = require('http');
var fs = require('fs');
var template = require('./lib/template.js');
var sanitizeHtml = require('sanitize-html');
var express = require('express');
var path = require('path');
var app = express();

//mysql
var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '111111',
  database : 'opentutorials'
});
connection.connect();

//  body-parser || Express v4.16.0 기준으로 express.js에서 자체 제공하기 때문에 따로 import 할 필요가 없다.
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//Route 기능으로 대체
var topic = require('./route/topic');
app.use('/topic', topic);

app.get('/', function(request, response){
  connection.query(`SELECT title FROM topic`, function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">Create</a>`
    );
    response.send(html);
  });
});
app.listen(3000, function(){
  console.log('Example app listening on port 3000');
});
