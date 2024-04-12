
const mysql = require('mysql');

function createSchema() {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
  });

  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;

  connection.query(createUserTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating user table: ' + err.stack);
      return;
    }
    console.log('User table created successfully');
  });

}

module.exports = createSchema;
