import type { NextApiRequest, NextApiResponse } from 'next'; // Importa os tipos para requisição e resposta do Next.js
import db from '../../../lib/back/db'; // Importa a instância do banco de dados configurada

// Exporta uma função assíncrona para tratar a requisição da API
export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Verifica se o método da requisição é GET
    if (req.method == 'GET') {
        // Executa uma query SQL bruta que retorna protestos com status 0, juntando com dados de geolocalização
        const teste = await db.raw(`
            SELECT 
                num_seq_protesto, 
                tema_protesto, 
                data_protesto,
                latitude,
                longitude 
            FROM protesto p 
            INNER JOIN geolocalizacao g ON p.num_seq_protesto = g.protesto_num_seq_protesto 
            WHERE status = 0;
        `);

        // Envia o resultado da consulta (somente as linhas) no corpo da resposta com status HTTP 200 (OK)
        res.status(200).json(teste.rows);
    }
  
}
