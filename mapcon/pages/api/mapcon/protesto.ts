import type { NextApiRequest, NextApiResponse } from 'next';
// Importa os tipos para a requisição e resposta do Next.js

import { getServerSession } from "next-auth"
// Importa a função para obter a sessão do usuário autenticado

import base from '../../../lib/back/base_query'
// Importa o módulo base com funções genéricas para manipulação do banco de dados (CRUD)

import { LogRequest } from './_helper';
// Importa função para registrar logs detalhados da requisição (útil para debug e auditoria)

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Função padrão exportada que vai responder as requisições HTTP para essa rota API

    const session = await getServerSession(req, res, { /* options */ });
    // Tenta obter a sessão do usuário com next-auth para verificar autenticação

    if (session) {
        // Se o usuário está autenticado, continua aqui

        LogRequest(__filename, req);
        // Registra no log detalhes da requisição (arquivo e dados da requisição)

        if (req.method == 'GET' && req.query.id) {
            // Se for GET e tiver query param id, busca um registro específico da tabela 'protesto' pelo id
            res.status(200).json(await base.getModel('protesto', { 'num_seq_protesto': req.query.id }))
        } else if (req.method == 'GET') {
            // Se for GET sem id, busca lista de registros na tabela 'protesto', aplicando filtros de query
            res.status(200).json(await base.getModels('protesto', req.query))
        } else if (req.method == 'POST') {
            // Se for POST, adiciona novo registro na tabela 'protesto' usando os dados do corpo da requisição
            res.status(200).json(await base.addModel('protesto', req.body))
        } else if (req.method == 'PUT'){
            // Se for PUT, atualiza registro existente identificado por 'num_seq_protesto' com os dados do corpo
            res.status(200).json(await base.updateModel('protesto',{ 'num_seq_protesto': req.body.num_seq_protesto },req.body))
        } else if (req.method == 'DELETE'){
            // Se for DELETE, exclui o registro identificado por 'num_seq_protesto' passado no corpo da requisição
            res.status(200).json(await base.deleteModel('protesto',{ 'num_seq_protesto': req.body.num_seq_protesto }))
        }

    } else {
        // Se não estiver autenticado, retorna status 401 com mensagem de acesso negado
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }
}
