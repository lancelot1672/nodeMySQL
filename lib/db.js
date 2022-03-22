var mysql = require('mysql');
var connection = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '111111',
  database : 'opentutorials',
  connectionLimit : 30
});

module.exports = connection;

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   password : '111111',
//   database : 'opentutorials',
//   connectionLimit : 30
// });
// connection.connect();

// module.exports = connection;