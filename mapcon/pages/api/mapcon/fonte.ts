// Importa os tipos para requisições e respostas da API do Next.js
import type { NextApiRequest, NextApiResponse } from 'next'

// Importa a função que obtém a sessão atual do usuário autenticado
import { getServerSession } from "next-auth"

// Importa o módulo base que contém funções genéricas para o CRUD no banco de dados
import base from '../../../lib/back/base_query'

// Importa função que registra logs das requisições realizadas
import { LogRequest } from './_helper'

// Exporta a função principal que lida com a API da entidade 'fonte'
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Obtém a sessão ativa para verificar se o usuário está autenticado
    const session = await getServerSession(req, res, { /* options */ });

    // Verifica se existe uma sessão (usuário autenticado)
    if (session) {

        // Registra a requisição atual no log (útil para auditoria e debug)
        LogRequest(__filename, req);

        // --- TRATAMENTO DOS MÉTODOS HTTP ---

        // Se for GET e possuir um parâmetro 'id', retorna um único registro da tabela 'fonte'
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel(
                'fonte',                         // Nome da tabela
                { 'num_seq_fonte': req.query.id } // Filtro pelo ID da fonte
            ))

        // Se for apenas GET (sem ID), retorna todos os registros da tabela 'fonte', com filtros opcionais via query string
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'fonte',        // Nome da tabela
                req.query       // Filtros passados na URL (opcional)
            ))

        // Se for POST, cria um novo registro na tabela 'fonte' com os dados enviados no corpo da requisição
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'fonte',        // Nome da tabela
                req.body        // Dados para criação do novo registro
            ))

        // Se for PUT, atualiza um registro existente com base no ID passado no corpo
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'fonte',                                         // Nome da tabela
                { 'num_seq_fonte': req.body.num_seq_fonte },     // Condição de atualização (ID)
                req.body                                         // Dados atualizados
            ))

        // Se for DELETE, remove o registro com o ID passado no corpo da requisição
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'fonte',                                         // Nome da tabela
                { 'num_seq_fonte': req.body.num_seq_fonte }      // Condição de exclusão (ID)
            ))
        }

    // Caso não exista uma sessão válida, retorna erro 401 (não autorizado)
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }
}
