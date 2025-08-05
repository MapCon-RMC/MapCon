// Importa os tipos para requisição e resposta da API do Next.js
import type { NextApiRequest, NextApiResponse } from 'next'

// Importa a função que recupera a sessão autenticada do NextAuth
import { getServerSession } from "next-auth"

// Importa funções genéricas para manipulação do banco de dados (CRUD)
import base from '../../../lib/back/base_query'

// Importa função de log para registrar detalhes da requisição
import { LogRequest } from './_helper'

// Exporta a função principal que irá tratar as requisições para o endpoint da API
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Obtém a sessão do usuário autenticado (caso exista)
    const session = await getServerSession(req, res, { /* options */ });

    // Verifica se o usuário está autenticado
    if (session) {

        // Registra log da requisição com nome do arquivo e detalhes
        LogRequest(__filename, req);

        // --- TRATAMENTO DAS OPERAÇÕES HTTP ---

        // Se a requisição for do tipo GET e tiver um parâmetro 'id', retorna um desdobramento específico
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel(
                'desdobramento',                        // Nome da tabela
                { 'num_seq_desdobramento': req.query.id } // Condição: filtra pelo ID
            ))

        // Se for GET sem ID, retorna a lista de todos os desdobramentos (com filtro opcional via query)
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'desdobramento',        // Nome da tabela
                req.query               // Filtros passados pela URL
            ))

        // Se for POST, adiciona um novo desdobramento com os dados do corpo da requisição
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'desdobramento',        // Nome da tabela
                req.body                // Dados do novo desdobramento
            ))

        // Se for PUT, atualiza os dados de um desdobramento existente
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'desdobramento',                                        // Nome da tabela
                { 'num_seq_desdobramento': req.body.num_seq_desdobramento }, // Condição para atualização
                req.body                                                // Novos dados
            ))

        // Se for DELETE, remove um desdobramento com base no ID enviado no corpo
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'desdobramento',                                        // Nome da tabela
                { 'num_seq_desdobramento': req.body.num_seq_desdobramento } // Condição para exclusão
            ))
        }

    // Se não houver sessão ativa, retorna erro de acesso negado (401)
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }
}
