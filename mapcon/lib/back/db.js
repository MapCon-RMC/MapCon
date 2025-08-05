// Importa as configurações do banco definidas no arquivo knexfile.js (geralmente com as conexões e opções do banco)
const config = require('../../knexfile');

// Exporta a instância do Knex já configurada para ser usada em outras partes da aplicação
module.exports = require('knex')(config);
