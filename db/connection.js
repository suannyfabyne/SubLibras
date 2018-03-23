var mysql = require('mysql');


var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'SL_DB',
      port: '3306'
    }
); 
 
 module.exports = connection;

