
var path = require('path');
var fs = require('fs');

var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var authUI = require('../lib/auth');

//mysql
var db = require('../lib/db.js');

router.get('/create', function(request, response){
    var title = 'WEB - create';
    if(authUI.isOwner(request, response)){
      db.query(`SELECT title FROM topic`, function(error, topics){
        var list = template.list(topics);
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
        `, '', authUI.statusUI(request, response));
        response.send(html);
      });
  }else{
    //로그인 해야 할 수 있음.
    response.send('<script> alert("로그인후 사용가능합니다."); history.back();</script>');
  }
  });
  router.post('/create_process', function(request, response){
    var post = request.body;

  
    db.query(`INSERT into topic (title, description, created, author_id) VALUES(?,?, NOW(), ?)`,[post.title, post.description, request.user.user_id] ,function(error, topics){
      if(error){
        throw error;
      }
      response.redirect(`/topic/${post.title}`);
    });
  });
  router.get('/update/:pageId', function(request, response){
    var title = path.parse(request.params.pageId).base;

    db.query(`SELECT * FROM topic`, function(error, topics){
      db.query(`SELECT * FROM topic where title='${title}'`, function(error, topic){
        var list = template.list(topics);
        var html = template.HTML(title, list,
          ``,
          `<form action="/topic/update_process" method="post">
          <input type="hidden" name="title" value="${title}">
          <p><input type="text" name="new_title" placeholder="title" value="${title}" style='width:1000px;'></p>
          <p>
            <textarea name="description" placeholder="description" style='width:1000px; height:500px; resize:none;'>${topic[0].description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`,
        authUI.statusUI(request, response)
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
    //db.query(`update topic set title='${new_title}', description='${description}' where title='${title}'`, function(error, topic){
    db.query(`update topic set title=?, description=? where title=?`, [new_title, description, title], function(error, topic){
      response.redirect(`/topic/${new_title}`);
    });
  });
  router.get('/delete/:pageId', function(request, response){
    var title = path.parse(request.params.pageId).base;
    db.query(`DELETE FROM topic where title=?`, [title], function(error, topic){
      response.redirect(`/`);
    });
  });
  router.get('/:pageId', function(request, response){
    var title = path.parse(request.params.pageId).base;
    db.query(`SELECT title FROM topic`,function(error, topics){
      if (error) throw error;
   
      db.query(`SELECT * FROM topic LEFT JOIN member ON topic.author_id = member.user_id where topic.title='${title}' `, function(error2, topic){
        if (error2) throw error2;
        var title = topic[0].title;
        var description = topic[0].description;
        var author = topic[0].name;

        var menu = `<a href="/topic/create">Create</a>`;

        //자기가 쓴 글만 update, delete 가능하게 하는 기능
        if(authUI.isOwner(request, response)){
          if(request.user.name === author){
            menu += ` | <a href="/topic/update/${title}">Update</a> | 
            <a href="/topic/delete/${title}" onclick="return confirm('Are you delete you want to ${title} Page??');">Delete</a>`;
          }
        }

        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description} <p>Write By <b>${author}</b></p>`,
          menu,
          authUI.statusUI(request, response)
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