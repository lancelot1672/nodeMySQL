
var path = require('path');
var fs = require('fs');

var express = require('express');
var router = express.Router();
var template = require('../lib/template');

//mysql
var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '111111',
  database : 'opentutorials'
});
connection.connect();

router.get('/create', function(request, response){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title" style='width:1000px;'></p>
          <p>
            <textarea name="description" placeholder="description" style='width:1000px; height:500px; resize:none;'></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      response.send(html);
    });
  });
  router.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
  
    fs.writeFile(`./data/${title}`, description, function(error){
      response.redirect(`/`);
    });
  });
  router.get('/update/:pageId', function(request, response){
    var title = path.parse(request.params.pageId).base;
    fs.readdir('./data', function(error, filelist){
      fs.readFile(`./data/${title}`, 'utf-8',function(error, description){
        var list = template.list(filelist);
        var html = template.HTML(title, list,
          ``,
          `<form action="/topic/update_process" method="post">
          <input type="hidden" name="title" value="${title}">
          <p><input type="text" name="new_title" placeholder="title" value="${title}" style='width:1000px;'></p>
          <p>
            <textarea name="description" placeholder="description" style='width:1000px; height:500px; resize:none;'>${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`
        );
        response.send(html);
      });
    });
  });
  router.post('/update_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var new_title = post.new_title;
    var description = post.description;
  
    fs.rename(`./data/${title}`, `./data/${new_title}`, function(error){
      fs.writeFile(`./data/${new_title}`, description, 'utf-8', function(error){
        response.redirect(`/topic/${new_title}`);
      });
    });
  });
  router.get('/delete/:pageId', function(request, response){
    var title = path.parse(request.params.pageId).base;
    fs.unlink(`./data/${title}`, function(err){
      response.redirect('/');
    });
  });
  router.get('/:pageId', function(request, response){
    var title = path.parse(request.params.pageId).base;
    connection.query(`SELECT title FROM topic`, function(error, topics){
      if (error) throw error;
   
      connection.query(`SELECT * FROM topic where title='${title}' `, function(error2, topic){
        if (error2) throw error2;
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/topic/create">Create</a> |
           <a href="/topic/update/${title}">Update</a> | 
          <a href="/topic/delete/${title}" onclick="return confirm('Are you sure you want to ${title} Page??);">Delete</a>`
        );
        response.send(html);
    });
  });
    // console.log("pageId : " + title);
    // fs.readdir('./data', function(error, filelist){
    //   fs.readFile(`./data/${title}`, function(error, description){
    //     var list = template.list(filelist);
    //     var html = template.HTML(title, list,
    //       `<h2>${title}</h2>${description}`,
    //       `<a href="/topic/create">Create</a> |
    //        <a href="/topic/update/${title}">Update</a> | 
    //       <a href="/topic/delete/${title}" onclick="return confirm('Are you sure you want to ${title} Page??);">Delete</a>`
    //     );
    //     response.send(html);
    //   });
    // });
  });

  module.exports = router;