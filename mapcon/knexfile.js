module.exports = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user:  process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  },
  pool: {
    min: 0,
    max: 10
  },
  // migrations: {
  //   tableName: 'knex_migrations'
  // }
};
