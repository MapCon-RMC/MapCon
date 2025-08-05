import type { NextApiRequest, NextApiResponse } from 'next';
// Importa os tipos para a requisição e resposta do Next.js

import { getServerSession } from "next-auth";
// Importa a função para obter a sessão do usuário autenticado

import base from '../../../lib/back/base_query'
// Importa módulo que contém funções genéricas para operações CRUD no banco

import { LogRequest } from './_helper';
// Importa função para registrar logs da requisição para depuração

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Obtém a sessão atual do usuário a partir da requisição e resposta
    const session = await getServerSession(req, res, { /* options */ });

    if (session) { // Se o usuário está autenticado
        LogRequest(__filename, req); // Registra a requisição no log

        if (req.method == 'GET' && req.query.id) {
            // Se for método GET e foi enviado um ID, busca um único registro pelo ID
            res.status(200).json(
                await base.getModel('local', { 'num_seq_local': req.query.id })
            );

        } else if (req.method == 'GET') {
            // Se for método GET sem ID, retorna lista de registros filtrada pelos parâmetros da query
            res.status(200).json(
                await base.getModels('local', req.query)
            );

        } else if (req.method == 'POST') {
            // Se for método POST, adiciona um novo registro com os dados do corpo da requisição
            res.status(200).json(
                await base.addModel('local', req.body)
            );

        } else if (req.method == 'PUT') {
            // Se for método PUT, atualiza o registro identificado pelo ID no corpo da requisição
            res.status(200).json(
                await base.updateModel('local', { 'num_seq_local': req.body.num_seq_local }, req.body)
            );

        } else if (req.method == 'DELETE') {
            // Se for método DELETE, exclui o registro identificado pelo ID no corpo da requisição
            res.status(200).json(
                await base.deleteModel('local', { 'num_seq_local': req.body.num_seq_local })
            );
        }

    } else {
        // Se o usuário não estiver autenticado, retorna erro 401 (Não autorizado)
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." });
    }
}
