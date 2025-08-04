// Exporta um objeto de configuração para o Knex.js
module.exports = {
  // Define o banco de dados a ser usado (neste caso, PostgreSQL)
  client: 'postgresql',

  // Dados de conexão com o banco, carregados das variáveis de ambiente
  connection: {
    host: process.env.DB_HOST,       // Endereço do servidor do banco
    database: process.env.DB_NAME,   // Nome do banco de dados
    user: process.env.DB_USER,       // Usuário do banco
    password: process.env.DB_PASS,   // Senha do banco
    port: process.env.DB_PORT        // Porta do banco (geralmente 5432)
  },

  // Configuração do pool de conexões (controle de múltiplas conexões simultâneas)
  pool: {
    min: 0,   // Mínimo de conexões no pool
    max: 10   // Máximo de conexões simultâneas
  },

  // Configuração opcional para as migrations
  // migrations: {
  //   tableName: 'knex_migrations' // Nome da tabela usada para controle de migrations
  // }
};
