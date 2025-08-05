// Define os tipos para requisição e resposta da API do Next.js
import type { NextApiRequest, NextApiResponse } from 'next'

// Importa funções genéricas de CRUD para o banco de dados
import base from '../../../lib/back/base_query'

// Importa função auxiliar para registrar logs das requisições (útil para auditoria e debug)
import { LogRequest } from './_helper'

// Importa função do NextAuth para obter a sessão do usuário autenticado
import { getServerSession } from "next-auth"

// Exporta a função principal da API, que responde dinamicamente de acordo com o método HTTP
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Obtém a sessão do usuário logado, se houver
    const session = await getServerSession(req, res, { /* options */ });

    // Verifica se o usuário está autenticado
    if (session) {

        // Loga a requisição recebida (arquivo atual e detalhes da requisição)
        LogRequest(__filename, req);

        // --- TRATAMENTO DAS REQUISIÇÕES ---

        // Se for uma requisição GET com ID (no caso, a URL da notícia), retorna uma notícia específica
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel(
                'crawling.crawling_news',          // Tabela do schema crawling no banco
                { 'url': req.query.id }            // Condição: busca pela URL
            ))

        // Se for uma requisição GET sem ID, retorna várias notícias com base nos filtros (se houver)
        } else if (req.method == 'GET') {     
            res.status(200).json(await base.getModels(
                'crawling.crawling_news',  // Nome da tabela
                req.query                  // Parâmetros de filtro passados na URL
            ))

        // Se for uma requisição PUT, atualiza os dados de uma notícia existente
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'crawling.crawling_news',                // Nome da tabela
                { 'url': req.body.url },                 // Condição para atualização (URL)
                req.body                                 // Novos dados da notícia
            ))

        // Se for uma requisição DELETE, remove uma notícia específica do banco
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'crawling.crawling_news',                // Nome da tabela
                { 'url': req.body.url }                  // Condição para exclusão (URL)
            ))
        }

    // Se o usuário não estiver autenticado, retorna erro 401 (acesso negado)
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }
}
