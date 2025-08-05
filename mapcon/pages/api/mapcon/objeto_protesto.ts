import type { NextApiRequest, NextApiResponse } from 'next';
// Importa os tipos para as requisições e respostas do Next.js

import { getServerSession } from "next-auth"
// Importa a função para obter a sessão do usuário autenticado

import base from '../../../lib/back/base_query'
// Importa um módulo base que abstrai operações de banco (CRUD genérico)

import { LogRequest } from './_helper';
// Importa função auxiliar para logar detalhes da requisição

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Obtém a sessão do usuário para verificar autenticação
    const session = await getServerSession(req, res, { /* options */ });

    if (session) { // Se o usuário está autenticado
        LogRequest(__filename, req); // Loga a requisição para depuração/auditoria

        if (req.method == 'GET' && req.query.id) {
            // Se for uma requisição GET e possui o parâmetro 'id'
            // Busca um único objeto de protesto pelo ID e retorna em JSON
            res.status(200).json(
                await base.getModel('objeto_protesto', { 'num_seq_objeto_protesto': req.query.id })
            );
        } else if (req.method == 'GET') {
            // Se for GET sem 'id', busca múltiplos objetos filtrados pelo query string
            res.status(200).json(
                await base.getModels('objeto_protesto', req.query)
            );
        } else if (req.method == 'POST') {
            // Cria um novo objeto de protesto usando os dados do corpo da requisição
            res.status(200).json(
                await base.addModel('objeto_protesto', req.body)
            );
        } else if (req.method == 'PUT') {
            // Atualiza o objeto de protesto identificado pelo 'num_seq_objeto_protesto' no corpo da requisição
            res.status(200).json(
                await base.updateModel('objeto_protesto', { 'num_seq_objeto_protesto': req.body.num_seq_objeto_protesto }, req.body)
            );
        } else if (req.method == 'DELETE') {
            // Remove o objeto de protesto pelo ID passado no corpo da requisição
            res.status(200).json(
                await base.deleteModel('objeto_protesto', { 'num_seq_objeto_protesto': req.body.num_seq_objeto_protesto })
            );
        }

    } else {
        // Se não estiver autenticado, retorna erro 401 com mensagem de acesso negado
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." });
    }
}
