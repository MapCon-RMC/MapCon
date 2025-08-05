import type { NextApiRequest, NextApiResponse } from 'next';
// Importa tipos para requisição e resposta no Next.js

import { getServerSession } from "next-auth";
// Importa função para obter sessão do usuário autenticado

import db from '../../../lib/back/db';
// Importa instância para acesso ao banco de dados (Knex ou similar)

import { LogRequest } from './_helper';
// Importa função para logar detalhes da requisição para depuração

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Pega a sessão do usuário para verificar autenticação
    const session = await getServerSession(req, res, { /* options */ });

    if (session) { // Se o usuário está autenticado
        LogRequest(__filename, req); // Registra informações da requisição no log

        // Se o método for GET e houver o parâmetro 'data' na query
        if (req.method == 'GET' && req.query.data) {
            // Executa consulta SQL raw para buscar até 10 protestos
            // mais próximos da data informada (req.query.data)
            const query = await db.raw(
                "SELECT num_seq_protesto, to_char(data_protesto,'DD/MM/YYYY') as data_protesto, tema_protesto \
                 FROM protesto \
                 ORDER BY ABS(data_protesto::date - TO_DATE(?,'YYYY-MM-DD')) \
                 LIMIT 10;",
                 [req.query.data]  // Parâmetro para a query segura
            );

            // Retorna o resultado da consulta (array de protestos)
            res.status(200).json(query.rows);
        }
    } else {
        // Caso o usuário não esteja autenticado, retorna erro 401
        res.status(401).json({ 
            "Acesso Negado": "Você não possui permissão para acessar esses dados." 
        });
    }
}
