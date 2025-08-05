import type { NextApiRequest, NextApiResponse } from 'next';
// Importa os tipos das requisições e respostas Next.js para tipagem TypeScript

import { getServerSession } from "next-auth"
// Importa função para obter a sessão autenticada do usuário

import base from '../../../lib/back/base_query'
// Importa módulo base para operações genéricas de banco (CRUD)

import { LogRequest } from './_helper';
// Importa função auxiliar para registrar logs da requisição

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Função padrão exportada para lidar com a requisição API

    const session = await getServerSession(req, res, { /* options */ });
    // Obtém sessão do usuário para verificar se está autenticado

    if (session) { 
        // Se usuário está autenticado, processa a requisição

        LogRequest(__filename, req);
        // Registra informações da requisição para auditoria e debug

        if (req.method == 'GET' && req.query.id) {
            // Se for método GET e tiver parâmetro 'id' na query
            // Retorna um único registro da tabela 'participacao_agente' com base no id
            res.status(200).json(
                await base.getModel('participacao_agente', { 'num_seq_participacao_agente': req.query.id })
            );

        } else if (req.method == 'GET') {
            // Se for GET sem id, retorna múltiplos registros filtrados pelos parâmetros da query
            res.status(200).json(
                await base.getModels('participacao_agente', req.query)
            );

        } else if (req.method == 'POST') {
            // Se for POST, cria um novo registro usando os dados enviados no corpo da requisição
            res.status(200).json(
                await base.addModel('participacao_agente', req.body)
            );

        } else if (req.method == 'PUT'){
            // Se for PUT, atualiza um registro identificado pelo 'num_seq_participacao_agente' do corpo da requisição
            res.status(200).json(
                await base.updateModel('participacao_agente', { 'num_seq_participacao_agente': req.body.num_seq_participacao_agente }, req.body)
            );

        } else if (req.method == 'DELETE'){
            // Se for DELETE, deleta o registro identificado pelo 'num_seq_participacao_agente' no corpo da requisição
            res.status(200).json(
                await base.deleteModel('participacao_agente', { 'num_seq_participacao_agente': req.body.num_seq_participacao_agente })
            );
        }

    } else {
        // Se o usuário não estiver autenticado, retorna erro 401 e mensagem de acesso negado
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." });
    }
}
