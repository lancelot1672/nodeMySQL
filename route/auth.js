var express = require('express');
var router = express.Router();

//mysql
var db = require('../lib/db.js');

router.get('/login', function(request, response){
    var html = `
      <html>
      <head>
        <title>로그인</title>
        <meta charset="utf-8">
      </head>
      <body>
        <a href="/">돌아가기</a><h3>Login</h3>
        <form action="/auth/login_process" method="post">
          <p><input type="text" name="user_id" placeholder="id"></p>
          <p><input type="password" name="user_pw" placeholder="password"></p>
          <p><input type="submit" value="Login"> <input type="reset" value="reset"></p>
        </form>
      </body>
      </html>
    `
    response.send(html);
  });
router.get('/logout', function(request, response){
    request.session.destroy(function(){
        response.redirect('/');
    });
})
router.get('/enroll', function(request, response){
    var html = `
    <html>
    <head>
      <title>회원가입</title>
      <meta charset="utf-8">
    </head>
    <body>
      <a href="/">돌아가기</a><h3>회원가입</h3>
      <form action="/auth/enroll_process" method="post">
        <p><input type="text" name="user_id" placeholder="id"></p>
        <p><input type="password" name="pw1" placeholder="password"></p>
        <p><input type="password" name="pw2" placeholder="password confirm"></p>
        <p><input type="text" name="author" placeholder="author"></p>
        <p><input type="text" name="profile" placeholder="profile"></p>
        <p><input type="submit" value="check"> <input type="reset" value="reset"></p>
      </form>
    </body>
    </html>
  `
  response.send(html);
});
router.post('/enroll_process', function(request, response){
    var user_id = request.body.user_id;
    var pw1 = request.body.pw1;
    var pw2 = request.body.pw2;
    var author = request.body.author;
    var profile = request.body.profile;
    db.getConnection(function(err, connection){ //Connection 연결
      connection.query(`select count(*) as idCount from opentutorials.member where user_id=?`,[user_id],function(error, result){
          if(error){
            throw error;
          }
          console.log(result[0].idCount);
          if(result[0].idCount === 1){
            //이미 있는 아이디
          }else{
              //없는 아이디 ㄱㄱ
              connection.query(`insert into opentutorials.member (user_id, user_pw, name, profile) VALUES (?,?,?,?)`,[user_id, pw1, author, profile],function(error2, result2){
                  response.redirect('/');
              });
          }
        });
        connection.release(); //Connection Pool 반환
    });
});

module.exports = router;