// Define os tipos para requisição e resposta da API do Next.js
import type { NextApiRequest, NextApiResponse } from 'next';

// Importa função para obter a sessão do usuário logado com NextAuth
import { getServerSession } from "next-auth"

// Importa funções genéricas de CRUD para o banco de dados
import base from '../../../lib/back/base_query'

// Importa função auxiliar para registrar logs das requisições (útil para auditoria e debug)
import { LogRequest } from './_helper';

// Exporta a função principal que trata todas as requisições HTTP para a entidade "cidade"
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Verifica se o usuário está autenticado por meio da sessão do NextAuth
    const session = await getServerSession(req, res, { /* options */ });

    // Se o usuário estiver logado, continua com o processamento da requisição
    if (session) {

        // Loga a requisição recebida (arquivo e método)
        LogRequest(__filename, req);

        // --- TRATAMENTO DAS REQUISIÇÕES ---

        // Caso seja uma requisição GET com um ID, retorna uma cidade específica
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel(
                'cidade',                             // Nome da tabela
                { 'num_seq_cidade': req.query.id }    // Condição de busca (pelo ID)
            ))

        // Caso seja uma requisição GET sem ID, retorna uma lista de cidades com filtros opcionais
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'cidade',      // Nome da tabela
                req.query      // Parâmetros da URL (ex: filtros de busca)
            ))

        // Caso seja uma requisição POST, insere uma nova cidade no banco
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'cidade',    // Nome da tabela
                req.body     // Dados enviados no corpo da requisição
            ))

        // Caso seja uma requisição PUT, atualiza os dados de uma cidade existente
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'cidade',                                                // Nome da tabela
                { 'num_seq_cidade': req.body.num_seq_cidade },           // Condição de atualização (ID)
                req.body                                                 // Novos dados
            ))

        // Caso seja uma requisição DELETE, remove uma cidade do banco
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'cidade',                                                // Nome da tabela
                { 'num_seq_cidade': req.body.num_seq_cidade }            // Condição de exclusão (ID)
            ))
        }

    // Se o usuário **não** estiver autenticado, retorna erro 401 - Acesso Negado
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }
}
