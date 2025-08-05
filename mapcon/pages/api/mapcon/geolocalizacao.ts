import type { NextApiRequest, NextApiResponse } from 'next';
// Importa tipos para requisição e resposta do Next.js

import { getServerSession } from "next-auth";
// Importa método para pegar a sessão do usuário autenticado

import base from '../../../lib/back/base_query';
// Importa módulo para operações genéricas no banco de dados

import { LogRequest } from './_helper';
// Importa função para logar detalhes da requisição

import db from '../../../lib/back/db';
// Importa instância do knex ou similar para consultas específicas

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Pega a sessão do usuário para autenticar
    const session = await getServerSession(req, res, { /* options */ });

    if (session) {  // Se o usuário está autenticado
        LogRequest(__filename, req); // Loga detalhes da requisição para debug

        // Se método é GET e existe parâmetro 'id', busca um registro por id
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(
                await base.getModel('geolocalizacao', { 'num_seq_geolocalizacao': req.query.id })
            );

        // Se método é GET e existe parâmetro protesto_num_seq_protesto, busca registro por protesto
        } else if (req.method == 'GET' && req.query.protesto_num_seq_protesto) {
            res.status(200).json(
                await db('geolocalizacao')
                    .where({'protesto_num_seq_protesto': req.query.protesto_num_seq_protesto})
                    .first()  // Pega só o primeiro registro encontrado
            );

        // Se método é GET mas sem parâmetros específicos, lista registros com filtros possíveis
        } else if (req.method == 'GET') {
            res.status(200).json(
                await base.getModels('geolocalizacao', req.query)
            );

        // Se método é POST, tenta inserir ou atualizar
        } else if (req.method == 'POST') {
            // Verifica se já existe uma geolocalização para o protesto informado
            const marked = await db('geolocalizacao')
                .where({'protesto_num_seq_protesto': req.body.protesto_num_seq_protesto})
                .first();

            if(marked){ // Se já existe, atualiza
                res.status(200).json(
                    await base.updateModel(
                        'geolocalizacao',
                        { 'num_seq_geolocalizacao': marked.num_seq_geolocalizacao },
                        req.body
                    )
                );
            } else { // Se não existe, insere novo registro
                res.status(200).json(
                    await base.addModel('geolocalizacao', req.body)
                );
            }

        // Se método é DELETE, deleta registro pelo id enviado no corpo
        } else if (req.method == 'DELETE'){
            res.status(200).json(
                await base.deleteModel('geolocalizacao', { 'num_seq_geolocalizacao': req.body.num_seq_geolocalizacao })
            );
        }

    } else {  // Se usuário não está autenticado, nega o acesso
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        });
    }
}
