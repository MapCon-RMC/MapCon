// Importa os tipos de requisição e resposta do Next.js
import type { NextApiRequest, NextApiResponse } from 'next'

// Importa a função para obter a sessão do usuário logado via next-auth
import { getServerSession } from "next-auth"

// Importa funções genéricas para lidar com operações no banco de dados
import base from '../../../lib/back/base_query'

// Importa função auxiliar para registrar logs da requisição
import { LogRequest } from './_helper'

// Função principal da API para manipulação da entidade 'fonte_protesto'
export default async (req: NextApiRequest, res: NextApiResponse) => {
    
    // Obtém a sessão do usuário autenticado
    const session = await getServerSession(req, res, { /* options */ });

    // Verifica se o usuário está autenticado
    if (session) {

        // Registra a requisição recebida (útil para auditoria e depuração)
        LogRequest(__filename, req);

        // --- VERIFICAÇÃO DOS MÉTODOS HTTP ---

        // Se o método for GET com parâmetro 'id', busca um único registro de 'fonte_protesto' pelo ID
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel(
                'fonte_protesto',                                      // Nome da tabela
                { 'num_seq_fonte_protesto': req.query.id }             // Condição de busca pelo ID
            ))

        // Se o método for GET (sem 'id'), retorna uma lista filtrada (ou completa) de registros
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'fonte_protesto',       // Nome da tabela
                req.query               // Filtros opcionais pela query string
            ))

        // Se o método for POST, cria um novo registro com os dados enviados no corpo
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'fonte_protesto',       // Nome da tabela
                req.body                // Dados do novo registro
            ))

        // Se o método for PUT, atualiza um registro existente com base no ID enviado no corpo
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'fonte_protesto',                                               // Nome da tabela
                { 'num_seq_fonte_protesto': req.body.num_seq_fonte_protesto },  // Condição para atualizar
                req.body                                                        // Novos dados
            ))

        // Se o método for DELETE, exclui um registro com base no ID do corpo
        } else if (req.method == 'DELETE') {
            console.log(req) // Loga a requisição no console (útil para debug)
            res.status(200).json(await base.deleteModel(
                'fonte_protesto',                                               // Nome da tabela
                { 'num_seq_fonte_protesto': req.body.num_seq_fonte_protesto }  // Condição para deletar
            ))
        }

    // Caso o usuário não esteja autenticado, retorna erro 401 (não autorizado)
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }
}
