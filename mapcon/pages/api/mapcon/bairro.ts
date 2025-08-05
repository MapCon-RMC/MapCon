// Tipagem das requisições e respostas da API do Next.js
import type { NextApiRequest, NextApiResponse } from 'next';

// Função para obter a sessão do usuário autenticado (via next-auth)
import { getServerSession } from "next-auth"

// Importa o módulo com funções reutilizáveis para acessar o banco (CRUD genérico)
import base from '../../../lib/back/base_query'

// Importa função auxiliar para logar os dados da requisição no console
import { LogRequest } from './_helper';

// Exporta a função padrão que trata a rota da API (assíncrona porque usará await)
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Recupera a sessão do usuário autenticado
    const session = await getServerSession(req, res, { /* options */ });

    // Se a sessão existe (usuário autenticado)...
    if (session) {

        // Exibe no console as informações da requisição recebida
        LogRequest(__filename, req);

        // Se for uma requisição GET com um ID específico informado via query string...
        if (req.method == 'GET' && req.query.id) {
            // Retorna apenas o bairro que tem o ID correspondente
            res.status(200).json(await base.getModel(
                'bairro',
                { 'num_seq_bairro': req.query.id }
            ))

        // Se for uma requisição GET **sem ID**, retorna todos os bairros com JOIN na cidade
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'bairro',
                req.query, // filtros, ordenação ou paginação
                'INNER JOIN cidade ON bairro.cidade_num_seq_cidade = cidade.num_seq_cidade' // traz dados da cidade associada
            ))

        // Se for uma requisição POST, adiciona um novo bairro no banco
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'bairro',
                req.body // dados enviados no corpo da requisição
            ))

        // Se for uma requisição PUT, atualiza os dados de um bairro existente
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'bairro',
                { 'num_seq_bairro': req.body.num_seq_bairro }, // critério para encontrar o registro
                req.body // dados atualizados
            ))

        // Se for uma requisição DELETE, remove um bairro específico
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'bairro',
                { 'num_seq_bairro': req.body.num_seq_bairro } // critério de exclusão
            ))
        }

    // Se o usuário **não** estiver autenticado, retorna erro 401 (não autorizado)
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }
}
