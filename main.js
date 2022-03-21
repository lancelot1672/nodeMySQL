var http = require('http');
var fs = require('fs');
var template = require('./lib/template.js');
var authUI = require('./lib/auth');
var sanitizeHtml = require('sanitize-html');
var express = require('express');
var path = require('path');
var app = express();

var session = require('express-session');


//mysql
var db = require('./lib/db.js');

//  body-parser || Express v4.16.0 기준으로 express.js에서 자체 제공하기 때문에 따로 import 할 필요가 없다.
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// session MySQL
var MySQLStore = require('express-mysql-session')(session);
app.use(session({
  secret : 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host : 'localhost',
    port:3306,
    user:'root',
    password:'111111',
    database:'opentutorials'
  })
}));

// passport
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

app.post('/auth/login_process', passport.authenticate('local', {
  //successRedirect : '/',
  failureRedirect : '/auth/login'
  }),
  function(request, response){
    request.session.save(function(){
      response.redirect('/');
    })
  });
  

  // var user_id = request.body.user_id;
  // var user_pw = request.body.user_pw;
  
  // console.log("id : " + user_id);
  // console.log("pw : " + user_pw);
  
  // db.query(`select count(*) as idCount from opentutorials.member where user_id=? and user_pw=?`,[user_id, user_pw],function(error, result){
  //   if(error){
  //     throw error;
  //   }
  //   console.log(result[0].idCount);
  //   if(result[0].idCount === 1){
  //     response.redirect('/');
  //   }else{
  //     response.redirect('/auth/login');
  //   }
  // });
//});

passport.serializeUser(function(user, done){
  console.log('serializeUser : ', user.user_id);
  done(null, user);
});
passport.deserializeUser(function(user, done){
  //
  console.log('deserializeUser : ', user);
  done(null, user);
});

passport.use(new LocalStrategy(
  {
    usernameField: 'user_id',
    passwordField: 'user_pw'
  },
  function(username, password, done){
    console.log('LocalStrategy', username, password);
    db.query(`select count(*) as idCount from opentutorials.member where user_id=? and user_pw=?`,[username, password],function(error, result){
    if(error){
      throw error;
    }

    if(result[0].idCount === 1){
      if(error){
        throw error;
      }
      db.query(`select * from opentutorials.member where user_id=? and user_pw=?`,[username, password],function(error2, result2){
        //passport.serializeUser에 전송
        return done(null, result2[0]);
      });

    }else{
      return done(null, false, {
        message : 'Incorrect userInfo.'
      });
    }
  });
  }
));

//Route 기능으로 대체
var topic = require('./route/topic');
app.use('/topic', topic);

//Route 기능으로 대체
var auth = require('./route/auth');

app.use('/auth', auth);

app.get('/', function(request, response){
  console.log('/', request.user);
  
  db.query(`SELECT title FROM topic`,function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/topic/create">Create</a>`,
      authUI.statusUI(request, response)
    );
    response.send(html);
  });
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000');
});
