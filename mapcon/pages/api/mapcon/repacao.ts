import type { NextApiRequest, NextApiResponse } from 'next';
// Importa os tipos de requisição e resposta do Next.js

import { getServerSession } from "next-auth"
// Importa a função para obter a sessão do usuário autenticado via next-auth

import base from '../../../lib/back/base_query'
// Importa funções genéricas para realizar operações CRUD no banco de dados

import { LogRequest } from './_helper';
// Importa função para registrar logs da requisição, útil para depuração e auditoria

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Função principal da API, que trata as requisições HTTP recebidas

    const session = await getServerSession(req, res, { /* options */ });
    // Obtém a sessão do usuário para verificar se está autenticado

    if (session) {
        // Se o usuário está autenticado, processa a requisição

        LogRequest(__filename, req);
        // Registra no log detalhes da requisição, incluindo o arquivo atual e dados da requisição

        if (req.method == 'GET' && req.query.id) {
            // Se o método for GET e possuir um parâmetro 'id', busca um registro específico por ID
            res.status(200).json(await base.getModel('repertorio_acao', { 'num_seq_repertorio_acao': req.query.id }))
        } else if (req.method == 'GET') {
            // Se o método for GET sem id, busca múltiplos registros, podendo filtrar pela query string
            res.status(200).json(await base.getModels('repertorio_acao', req.query))
        } else if (req.method == 'POST') {
            // Se o método for POST, adiciona um novo registro com os dados do corpo da requisição
            res.status(200).json(await base.addModel('repertorio_acao', req.body))
        } else if (req.method == 'PUT'){
            // Se o método for PUT, atualiza um registro existente identificado pelo campo num_seq_repertorio_acao
            res.status(200).json(await base.updateModel('repertorio_acao',{ 'num_seq_repertorio_acao': req.body.num_seq_repertorio_acao },req.body))
        } else if (req.method == 'DELETE'){
            // Se o método for DELETE, remove o registro identificado pelo campo num_seq_repertorio_acao no corpo
            console.log(req)
            res.status(200).json(await base.deleteModel('repertorio_acao',{ 'num_seq_repertorio_acao': req.body.num_seq_repertorio_acao }))
        }

    } else {
        // Se não estiver autenticado, retorna status 401 com mensagem de acesso negado
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }

}
