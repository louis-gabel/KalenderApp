const mysql = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'insert-password-here',
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS test_db;');
  await connection.end();
}

setupDatabase();
