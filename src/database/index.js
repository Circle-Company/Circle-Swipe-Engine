const mysql = require('mysql2')
require('dotenv').config()  

const db_config = {
    development: {
      host: process.env.DEVELOPMENT_DB_HOST,
      user: process.env.DEVELOPMENT_DB_USERNAME,
      password: process.env.DEVELOPMENT_DB_PASSWORD,
      database: process.env.DEVELOPMENT_DB_NAME,
    },
    test: {
      host: process.env.TEST_DB_HOST,
      user: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
    },
    production: {
      host: process.env.PRODUCTION_DB_HOST,
      user: process.env.PRODUCTION_DB_USERNAME,
      password: process.env.PRODUCTION_DB_PASSWORD,
      database: process.env.PRODUCTION_DB_NAME,
    }
  }

const DB_CONFIG =
    process.env.NODE_ENV === 'development'? db_config.development: db_config.development
    | process.env.NODE_ENV === 'production'? db_config.production: db_config.development
    | process.env.NODE_ENV === 'test'? db_config.test: db_config.test
    | db_config.development

// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({...DB_CONFIG})

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conexão bem sucedida ao banco de dados MySQL.');
});

module.exports = connection