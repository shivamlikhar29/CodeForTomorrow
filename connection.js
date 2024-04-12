const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'cft'
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