const mysql = require('mysql')

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE'
  });

 connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database: ' + err.stack);
      res.status(500).send('Error connecting to database');
      return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
})

module.exports = connection
